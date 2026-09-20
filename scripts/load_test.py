"""
Script de pruebas de carga para el backend monolitico de Cheapest.

Generado con ayuda de un agente de IA (Claude) para el Laboratorio 2 de
Arquitecturas de Software Robustas. Usado para los escenarios > 450 threads
(Alta carga, Muy alta carga, Estres, Estres fuerte) donde JMeter deja de ser
confiable.

Requiere una sola libreria externa: httpx
    pip install httpx

Ejemplos de ejecucion:
    python load_test.py --endpoint GET --users 1500 --ramp-up 75 --duration 60
    python load_test.py --endpoint POST --users 3000 --ramp-up 100 --duration 60

Salida:
    results_get.csv  o  results_post.csv  (segun --endpoint)
    Resumen impreso en consola: total requests, throughput, latencia
    promedio/p95/p99 y error % .
"""

import argparse
import asyncio
import csv
import random
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone

import httpx

BASE_URL = "http://localhost:3000"

# IDs fijos que trae seed.sql (ver src/datasources/seed.sql)
TIENDA_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"
ZONA = "Zona Norte"
MONEDA_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc"
PRODUCTO_ID_FALLBACK = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"


@dataclass
class RequestResult:
    timestamp_iso: str
    status_code: int
    latency_ms: float
    error: str = ""


@dataclass
class Stats:
    results: list = field(default_factory=list)
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def add(self, result: RequestResult) -> None:
        async with self.lock:
            self.results.append(result)


async def fetch_producto_ids(client: httpx.AsyncClient, n: int) -> list[str]:
    """Trae hasta n productoId reales desde /logistics/productos.
    Si falla, cae en un solo producto conocido repetido (seed.sql)."""
    try:
        resp = await client.get(f"{BASE_URL}/logistics/productos", timeout=10)
        resp.raise_for_status()
        data = resp.json()
        ids = [p["id"] for p in data if "id" in p]
        if len(ids) >= n:
            return random.sample(ids, n)
        if ids:
            return [random.choice(ids) for _ in range(n)]
    except Exception:
        pass
    return [PRODUCTO_ID_FALLBACK] * n


def build_pedido_body(producto_ids: list[str]) -> dict:
    """Pedido 'grande' con > 20 items, como pide el laboratorio."""
    items = [
        {
            "productoId": pid,
            "cantidad": random.randint(1, 10),
            "precioUnitario": round(random.uniform(1000, 50000), 2),
            "descuento": 0,
            "monedaId": MONEDA_ID,
        }
        for pid in producto_ids
    ]
    monto_total = sum(i["cantidad"] * i["precioUnitario"] for i in items)
    return {
        "identificador": f"PED-LOAD-{uuid.uuid4()}",
        "tiendaId": TIENDA_ID,
        "fechaHoraCreacion": datetime.now(timezone.utc).isoformat(),
        "montoTotal": round(monto_total, 2),
        "monedaId": MONEDA_ID,
        "estado": "creado",
        "items": items,
    }


async def do_get(client: httpx.AsyncClient) -> RequestResult:
    start = time.perf_counter()
    ts = datetime.now(timezone.utc).isoformat()
    try:
        resp = await client.get(
            f"{BASE_URL}/logistics/tenderos/productos-disponibles",
            params={"tiendaId": TIENDA_ID, "zona": ZONA},
            timeout=10,
        )
        latency_ms = (time.perf_counter() - start) * 1000
        error = "" if resp.status_code < 400 else f"HTTP {resp.status_code}"
        return RequestResult(ts, resp.status_code, latency_ms, error)
    except httpx.TimeoutException:
        latency_ms = (time.perf_counter() - start) * 1000
        return RequestResult(ts, 0, latency_ms, "timeout")
    except httpx.RequestError as exc:
        latency_ms = (time.perf_counter() - start) * 1000
        return RequestResult(ts, 0, latency_ms, f"connection_error: {exc}")


async def do_post(client: httpx.AsyncClient, producto_ids: list[str]) -> RequestResult:
    body = build_pedido_body(producto_ids)
    start = time.perf_counter()
    ts = datetime.now(timezone.utc).isoformat()
    try:
        resp = await client.post(
            f"{BASE_URL}/logistics/pedidos",
            json=body,
            headers={"Content-Type": "application/json", "Accept": "application/json"},
            timeout=10,
        )
        latency_ms = (time.perf_counter() - start) * 1000
        error = "" if resp.status_code < 400 else f"HTTP {resp.status_code}"
        return RequestResult(ts, resp.status_code, latency_ms, error)
    except httpx.TimeoutException:
        latency_ms = (time.perf_counter() - start) * 1000
        return RequestResult(ts, 0, latency_ms, "timeout")
    except httpx.RequestError as exc:
        latency_ms = (time.perf_counter() - start) * 1000
        return RequestResult(ts, 0, latency_ms, f"connection_error: {exc}")


async def worker(
    client: httpx.AsyncClient,
    endpoint: str,
    end_time: float,
    stats: Stats,
    producto_ids: list[str],
) -> None:
    """Un 'usuario virtual': manda requests en bucle hasta que se acabe el tiempo."""
    while time.perf_counter() < end_time:
        if endpoint == "GET":
            result = await do_get(client)
        else:
            result = await do_post(client, producto_ids)
        await stats.add(result)


async def run_load_test(users: int, ramp_up: int, duration: int, endpoint: str) -> Stats:
    stats = Stats()
    limits = httpx.Limits(max_connections=users + 50, max_keepalive_connections=users)
    async with httpx.AsyncClient(limits=limits) as client:
        producto_ids: list[str] = []
        if endpoint == "POST":
            producto_ids = await fetch_producto_ids(client, 25)

        test_start = time.perf_counter()
        end_time = test_start + ramp_up + duration
        delay_per_user = ramp_up / users if users > 0 else 0

        tasks = []
        for i in range(users):
            await asyncio.sleep(delay_per_user)
            tasks.append(
                asyncio.create_task(worker(client, endpoint, end_time, stats, producto_ids))
            )

        await asyncio.gather(*tasks)
    return stats


def percentile(sorted_values: list[float], pct: float) -> float:
    if not sorted_values:
        return 0.0
    k = (len(sorted_values) - 1) * (pct / 100)
    f = int(k)
    c = min(f + 1, len(sorted_values) - 1)
    if f == c:
        return sorted_values[f]
    return sorted_values[f] + (sorted_values[c] - sorted_values[f]) * (k - f)


def summarize_and_export(stats: Stats, endpoint: str, wall_seconds: float) -> None:
    results = stats.results
    total = len(results)
    latencies = sorted(r.latency_ms for r in results)
    errors = [r for r in results if r.error]
    error_pct = (len(errors) / total * 100) if total else 0.0
    throughput = total / wall_seconds if wall_seconds > 0 else 0.0
    avg_latency = sum(latencies) / total if total else 0.0
    p95 = percentile(latencies, 95)
    p99 = percentile(latencies, 99)

    filename = f"results_{endpoint.lower()}.csv"
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp_iso", "status_code", "latency_ms", "error"])
        for r in results:
            writer.writerow([r.timestamp_iso, r.status_code, f"{r.latency_ms:.2f}", r.error])

    print("=" * 60)
    print(f"Resumen de la prueba — {endpoint}")
    print("=" * 60)
    print(f"Total requests:      {total}")
    print(f"Duracion real (s):   {wall_seconds:.1f}")
    print(f"Throughput (req/s):  {throughput:.2f}")
    print(f"Latencia promedio:   {avg_latency:.2f} ms")
    print(f"Latencia p95:        {p95:.2f} ms")
    print(f"Latencia p99:        {p99:.2f} ms")
    print(f"Error %:             {error_pct:.2f}%")
    print(f"Resultados guardados en: {filename}")
    print("=" * 60)


def main() -> None:
    parser = argparse.ArgumentParser(description="Load test para Cheapest API")
    parser.add_argument("--endpoint", choices=["GET", "POST"], required=True)
    parser.add_argument("--users", type=int, required=True, help="Concurrencia objetivo")
    parser.add_argument("--ramp-up", type=int, required=True, help="Segundos para alcanzar --users")
    parser.add_argument("--duration", type=int, default=60, help="Segundos sostenidos tras el ramp-up")
    args = parser.parse_args()

    wall_start = time.perf_counter()
    stats = asyncio.run(run_load_test(args.users, args.ramp_up, args.duration, args.endpoint))
    wall_seconds = time.perf_counter() - wall_start

    summarize_and_export(stats, args.endpoint, wall_seconds)


if __name__ == "__main__":
    main()
