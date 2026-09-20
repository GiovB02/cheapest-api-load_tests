/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Ventas (e2e)', () => {
  let app: INestApplication<App>;
  let testProductoExternoId: string;
  let testVentaId: string;
  const testTiendaId = '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9'; // From mock
  const testMonedaId = '550e8400-e29b-41d4-a716-446655440000';
  let testProductoId: string; // Create this in beforeAll instead of hardcoding

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a test producto for catalog-based sales
    const productoResponse = await request(app.getHttpServer())
      .post('/logistics/productos')
      .send({
        codigoInterno: 'TEST-CAT-001',
        codigoBarras: '9999999999999',
        nombre: 'Producto Catalogo Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: 'Unidad',
        precioBase: 20.0,
        monedaId: testMonedaId,
      });

    testProductoId = productoResponse.body.id;

    // Create a test producto externo
    const productoExternoResponse = await request(app.getHttpServer())
      .post('/ventas/productos-externos')
      .send({
        tiendaId: testTiendaId,
        codigoBarras: '7501234567890',
        nombre: 'Coca Cola 2L Test',
        categoria: 'Bebidas',
        precioBase: 25.5,
        monedaId: testMonedaId,
        cantidad: 100.0,
      });

    testProductoExternoId = productoExternoResponse.body.id;
  });

  afterAll(async () => {
    // Clean up test data in proper order to avoid foreign key constraints
    if (app) {
      if (testVentaId) {
        await request(app.getHttpServer())
          .delete(`/ventas/ventas/${testVentaId}`)
          .catch(() => {}); // Ignore errors during cleanup
      }
      if (testProductoExternoId) {
        await request(app.getHttpServer())
          .delete(`/ventas/productos-externos/${testProductoExternoId}`)
          .catch(() => {}); // Ignore errors during cleanup
      }
      if (testProductoId) {
        await request(app.getHttpServer())
          .delete(`/logistics/productos/${testProductoId}`)
          .catch(() => {}); // Ignore errors during cleanup
      }
      await app.close();
    }
  });

  describe('ProductoExterno', () => {
    it('should create a producto externo', () => {
      return request(app.getHttpServer())
        .post('/ventas/productos-externos')
        .send({
          tiendaId: testTiendaId,
          codigoBarras: '1234567890123',
          nombre: 'Producto Test E2E',
          categoria: 'Alimentos',
          precioBase: 15.75,
          monedaId: testMonedaId,
          cantidad: 50.0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.tiendaId).toBe(testTiendaId);
          expect(res.body.codigoBarras).toBe('1234567890123');
          expect(res.body.nombre).toBe('Producto Test E2E');
          expect(res.body.categoria).toBe('Alimentos');
          expect(res.body.precioBase).toBe(15.75);
          expect(res.body.cantidad).toBe(50.0);
        });
    });

    it('should get all productos externos', () => {
      return request(app.getHttpServer())
        .get('/ventas/productos-externos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should filter productos externos by tiendaId', () => {
      return request(app.getHttpServer())
        .get(`/ventas/productos-externos?tiendaId=${testTiendaId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((producto: any) => {
            expect(producto.tiendaId).toBe(testTiendaId);
          });
        });
    });

    it('should filter productos externos by categoria', () => {
      return request(app.getHttpServer())
        .get('/ventas/productos-externos?categoria=Bebidas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((producto: any) => {
              expect(producto.categoria).toBe('Bebidas');
            });
          }
        });
    });

    it('should filter productos externos by nombre (partial match)', () => {
      return request(app.getHttpServer())
        .get('/ventas/productos-externos?nombre=Coca')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((producto: any) => {
              expect(producto.nombre.toLowerCase()).toContain('coca');
            });
          }
        });
    });

    it('should get producto externo by id', async () => {
      const result = await request(app.getHttpServer())
        .get(`/ventas/productos-externos/${testProductoExternoId}`)
        .expect(200);

      expect(result.body.id).toBe(testProductoExternoId);
      expect(result.body.nombre).toBe('Coca Cola 2L Test');
    });

    it('should update producto externo', async () => {
      const result = await request(app.getHttpServer())
        .patch(`/ventas/productos-externos/${testProductoExternoId}`)
        .send({
          precioBase: 30.0,
          cantidad: 150.0,
        })
        .expect(200);

      expect(result.body.id).toBe(testProductoExternoId);
      expect(result.body.precioBase).toBe(30.0);
      expect(result.body.cantidad).toBe(150.0);
    });

    it('should return 404 when getting non-existent producto externo', () => {
      return request(app.getHttpServer())
        .get('/ventas/productos-externos/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 400 when creating producto with non-existent tienda', () => {
      return request(app.getHttpServer())
        .post('/ventas/productos-externos')
        .send({
          tiendaId: '00000000-0000-0000-0000-000000000000',
          codigoBarras: '9999999999999',
          nombre: 'Invalid Producto',
          categoria: 'Test',
          precioBase: 10.0,
          monedaId: testMonedaId,
          cantidad: 10.0,
        })
        .expect(400);
    });
  });

  describe('Venta', () => {
    it('should create a venta with items', async () => {
      const result = await request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T10:30:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 2,
              precioUnitario: 26.0,
            },
            {
              productoExternoId: testProductoExternoId,
              cantidad: 3,
              precioUnitario: 26.0,
            },
          ],
        })
        .expect(201);

      testVentaId = result.body.id;

      expect(result.body).toHaveProperty('id');
      expect(result.body.tiendaId).toBe(testTiendaId);
      expect(result.body.total).toBe(130.0); // (2 + 3) * 26.0
      expect(result.body.items).toHaveLength(2);
      expect(result.body.items[0].productoExternoId).toBe(
        testProductoExternoId,
      );
    });

    it('should get all ventas', () => {
      return request(app.getHttpServer())
        .get('/ventas/ventas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should filter ventas by tiendaId', () => {
      return request(app.getHttpServer())
        .get(`/ventas/ventas?tiendaId=${testTiendaId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((venta: any) => {
            expect(venta.tiendaId).toBe(testTiendaId);
          });
        });
    });

    it('should filter ventas by fecha range', () => {
      return request(app.getHttpServer())
        .get(
          '/ventas/ventas?fechaDesde=2026-01-01T00:00:00.000Z&fechaHasta=2026-12-31T23:59:59.999Z',
        )
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should filter ventas by productoExternoId', () => {
      return request(app.getHttpServer())
        .get(`/ventas/ventas?productoExternoId=${testProductoExternoId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((venta: any) => {
              const hasProduct = venta.items.some(
                (item: any) => item.productoExternoId === testProductoExternoId,
              );
              expect(hasProduct).toBe(true);
            });
          }
        });
    });

    it('should get venta by id with items', async () => {
      // First create a venta
      const createResponse = await request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T15:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 5,
              precioUnitario: 25.0,
            },
          ],
        });

      const ventaId = createResponse.body.id;

      const result = await request(app.getHttpServer())
        .get(`/ventas/ventas/${ventaId}`)
        .expect(200);

      expect(result.body.id).toBe(ventaId);
      expect(result.body.total).toBe(125.0); // 5 * 25.0
      expect(result.body.items).toHaveLength(1);

      // Clean up
      await request(app.getHttpServer())
        .delete(`/ventas/ventas/${ventaId}`)
        .expect(200);
    });

    it('should update venta items and recalculate total', async () => {
      // First create a venta
      const createResponse = await request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T16:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 1,
              precioUnitario: 10.0,
            },
          ],
        });

      const ventaId = createResponse.body.id;
      expect(createResponse.body.total).toBe(10.0);

      // Update with new items
      const updateResult = await request(app.getHttpServer())
        .patch(`/ventas/ventas/${ventaId}`)
        .send({
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 4,
              precioUnitario: 15.0,
            },
          ],
        })
        .expect(200);

      expect(updateResult.body.total).toBe(60.0); // 4 * 15.0
      expect(updateResult.body.items).toHaveLength(1);

      // Clean up
      await request(app.getHttpServer())
        .delete(`/ventas/ventas/${ventaId}`)
        .expect(200);
    });

    it('should update only fechaHora without changing items', async () => {
      // First create a venta
      const createResponse = await request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T17:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 2,
              precioUnitario: 20.0,
            },
          ],
        });

      const ventaId = createResponse.body.id;
      const originalTotal = createResponse.body.total;

      // Update only fechaHora
      const updateResult = await request(app.getHttpServer())
        .patch(`/ventas/ventas/${ventaId}`)
        .send({
          fechaHora: '2026-02-10T10:00:00.000Z',
        })
        .expect(200);

      expect(updateResult.body.total).toBe(originalTotal); // Total unchanged
      expect(new Date(updateResult.body.fechaHora).toISOString()).toBe(
        '2026-02-10T10:00:00.000Z',
      );

      // Clean up
      await request(app.getHttpServer())
        .delete(`/ventas/ventas/${ventaId}`)
        .expect(200);
    });

    it('should return 404 when getting non-existent venta', () => {
      return request(app.getHttpServer())
        .get('/ventas/ventas/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 400 when creating venta with non-existent tienda', () => {
      return request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: '00000000-0000-0000-0000-000000000000',
          fechaHora: '2026-02-09T10:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 1,
              precioUnitario: 10.0,
            },
          ],
        })
        .expect(400);
    });

    it('should return 400 when creating venta with non-existent producto externo', () => {
      return request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T10:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: '00000000-0000-0000-0000-000000000000',
              cantidad: 1,
              precioUnitario: 10.0,
            },
          ],
        })
        .expect(400);
    });

    it('should create venta with productoId from catalog', async () => {
      const result = await request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T10:30:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              productoId: testProductoId,
              cantidad: 2,
              precioUnitario: 25.0,
            },
          ],
        })
        .expect(201);

      expect(result.body).toHaveProperty('id');
      expect(result.body.tiendaId).toBe(testTiendaId);
      expect(result.body.total).toBe(50.0);
      expect(result.body.items).toHaveLength(1);
      expect(result.body.items[0].productoExternoId).toBe(
        testProductoExternoId,
      );
      expect(result.body.items[0].productoId).toBe(testProductoId);

      // Clean up
      await request(app.getHttpServer())
        .delete(`/ventas/ventas/${result.body.id}`)
        .expect(200);
    });

    it('should return 400 when creating venta with non-existent productoId', () => {
      return request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T10:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              productoId: '00000000-0000-0000-0000-000000000000',
              cantidad: 1,
              precioUnitario: 10.0,
            },
          ],
        })
        .expect(400);
    });

    it('should update venta items with productoId', async () => {
      // First create a venta
      const createResponse = await request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T16:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 1,
              precioUnitario: 10.0,
            },
          ],
        });

      const ventaId = createResponse.body.id;

      // Update with productoId
      const updateResult = await request(app.getHttpServer())
        .patch(`/ventas/ventas/${ventaId}`)
        .send({
          items: [
            {
              productoExternoId: testProductoExternoId,
              productoId: testProductoId,
              cantidad: 3,
              precioUnitario: 20.0,
            },
          ],
        })
        .expect(200);

      expect(updateResult.body.total).toBe(60.0);
      expect(updateResult.body.items).toHaveLength(1);
      expect(updateResult.body.items[0].productoId).toBe(testProductoId);

      // Clean up
      await request(app.getHttpServer())
        .delete(`/ventas/ventas/${ventaId}`)
        .expect(200);
    });

    it('should return 400 when updating venta with invalid productoId', async () => {
      // First create a venta
      const createResponse = await request(app.getHttpServer())
        .post('/ventas/ventas')
        .send({
          tiendaId: testTiendaId,
          fechaHora: '2026-02-09T16:00:00.000Z',
          monedaId: testMonedaId,
          items: [
            {
              productoExternoId: testProductoExternoId,
              cantidad: 1,
              precioUnitario: 10.0,
            },
          ],
        });

      const ventaId = createResponse.body.id;

      // Try to update with invalid productoId
      await request(app.getHttpServer())
        .patch(`/ventas/ventas/${ventaId}`)
        .send({
          items: [
            {
              productoExternoId: testProductoExternoId,
              productoId: '00000000-0000-0000-0000-000000000000',
              cantidad: 3,
              precioUnitario: 20.0,
            },
          ],
        })
        .expect(400);

      // Clean up
      await request(app.getHttpServer())
        .delete(`/ventas/ventas/${ventaId}`)
        .expect(200);
    });
  });
});
