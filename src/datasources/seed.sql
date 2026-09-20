-- =============================================================
-- Base seed data – used by default SEED_MODE (e2e-compatible)
-- All UUIDs are fixed so e2e tests can rely on them.
-- =============================================================

-- Items de Inventario
INSERT INTO items_inventario (id, "productoId", "tiendaId", cantidad, "precioVenta", "monedaId", "createdAt", "updatedAt") VALUES
('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 100, 25.50, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('22222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 50, 15.75, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('33333333-3333-4333-8333-333333333333', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc', 75, 27.00, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('44444444-4444-4444-8444-444444444444', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaac', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 200, 10.00, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('55555555-5555-4555-8555-555555555555', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaad', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc', 150, 45.99, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Registros de Compra
INSERT INTO registros_compra_producto_tienda (id, "tiendaId", "productoId", "compraId", "itemInventarioId", "fechaCompra", cantidad, "createdAt", "updatedAt") VALUES
('c1111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', '11111111-1111-4111-8111-111111111111', '2026-01-15 10:30:00', 50, NOW(), NOW()),
('c2222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-ddddddddddde', '11111111-1111-4111-8111-111111111111', '2026-01-20 14:15:00', 50, NOW(), NOW()),
('c3333333-3333-4333-8333-333333333333', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab', 'dddddddd-dddd-4ddd-8ddd-dddddddddddf', '22222222-2222-4222-8222-222222222222', '2026-01-18 09:00:00', 50, NOW(), NOW()),
('c4444444-4444-4444-8444-444444444444', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'dddddddd-dddd-4ddd-8ddd-ddddddddddda', '33333333-3333-4333-8333-333333333333', '2026-01-22 11:45:00', 75, NOW(), NOW()),
('c5555555-5555-4555-8555-555555555555', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaac', 'dddddddd-dddd-4ddd-8ddd-dddddddddddb', '44444444-4444-4444-8444-444444444444', '2026-01-25 16:20:00', 200, NOW(), NOW());

-- Registros de Venta
INSERT INTO registros_venta_producto_tienda (id, "tiendaId", "productoId", "ventaId", "itemInventarioId", "fechaVenta", cantidad, "createdAt", "updatedAt") VALUES
('f1111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '11111111-1111-4111-8111-111111111111', '2026-01-28 10:30:00', 10, NOW(), NOW()),
('f2222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeef', '11111111-1111-4111-8111-111111111111', '2026-01-29 15:45:00', 15, NOW(), NOW()),
('f3333333-3333-4333-8333-333333333333', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee0', '22222222-2222-4222-8222-222222222222', '2026-01-30 12:00:00', 5, NOW(), NOW()),
('f4444444-4444-4444-8444-444444444444', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', '33333333-3333-4333-8333-333333333333', '2026-01-31 09:30:00', 20, NOW(), NOW()),
('f5555555-5555-4555-8555-555555555555', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaac', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2', '44444444-4444-4444-8444-444444444444', '2026-02-01 14:20:00', 25, NOW(), NOW()),
('f6666666-6666-4666-8666-666666666666', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaad', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3', '55555555-5555-4555-8555-555555555555', '2026-02-02 11:15:00', 10, NOW(), NOW());

-- Productos (Logística)
INSERT INTO productos (id, "codigoInterno", "codigoBarras", nombre, marca, categoria, presentacion, "precioBase", "monedaId", "createdAt", "updatedAt") VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'PROD001', '1234567890123', 'Producto Ejemplo 1', 'Marca A', 'Categoria 1', 'Caja 10 unidades', 25.50, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', NOW(), NOW()),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab', 'PROD002', '1234567890124', 'Producto Ejemplo 2', 'Marca B', 'Categoria 1', 'Bolsa 5 kg', 15.75, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', NOW(), NOW()),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaac', 'PROD003', '1234567890125', 'Producto Ejemplo 3', 'Marca A', 'Categoria 2', 'Botella 1L', 10.00, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', NOW(), NOW()),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaad', 'PROD004', '1234567890126', 'Producto Ejemplo 4', 'Marca C', 'Categoria 2', 'Paquete 20 unidades', 45.99, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', NOW(), NOW());

-- Catálogos
INSERT INTO catalogos (id, "tiendaId", "vigenciaDesde", "vigenciaHasta", zona, "createdAt", "updatedAt") VALUES
('ca711111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '2026-02-01 00:00:00', '2026-12-31 23:59:59', 'Zona Norte', NOW(), NOW()),
('ca722222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc', '2026-02-01 00:00:00', '2026-12-31 23:59:59', 'Zona Sur', NOW(), NOW());

-- Catálogo–Producto junction
INSERT INTO "catalogos_productos_productos" ("catalogosId", "productosId") VALUES
('ca711111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
('ca711111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab'),
('ca711111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaac'),
('ca722222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
('ca722222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaad');

-- Promociones
INSERT INTO promociones (id, nombre, "precioPromocional", "monedaId", "productoId", inicio, fin, restricciones, "createdAt", "updatedAt") VALUES
('f0a11111-1111-4111-8111-111111111111', 'Promoción Producto 1', 20.00, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '2026-02-01 00:00:00', '2026-02-28 23:59:59', 100, NOW(), NOW()),
('f0a22222-2222-4222-8222-222222222222', 'Promoción Producto 2', 12.00, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab', '2026-02-01 00:00:00', '2026-02-28 23:59:59', 50, NOW(), NOW());

-- Promocion Tiendas
INSERT INTO promocion_tiendas (id, "promocionId", "tiendaId") VALUES
('ab111111-1111-4111-8111-111111111111', 'f0a11111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
('ab222222-2222-4222-8222-222222222222', 'f0a22222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
('ab333333-3333-4333-8333-333333333333', 'f0a22222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc');

-- Pedidos
INSERT INTO pedidos (id, identificador, "tiendaId", "fechaHoraCreacion", "montoTotal", "monedaId", estado, "createdAt", "updatedAt") VALUES
('ed111111-1111-4111-8111-111111111111', 'PED-001', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '2026-02-03 10:00:00', 45.50, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'creado', NOW(), NOW()),
('ed222222-2222-4222-8222-222222222222', 'PED-002', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc', '2026-02-03 11:00:00', 75.75, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'aprobado', NOW(), NOW());

-- Items de Pedido
INSERT INTO items_pedido (id, "pedidoId", "productoId", cantidad, "precioUnitario", descuento, "monedaId", lote, "fechaVencimiento", "createdAt", "updatedAt") VALUES
('1f111111-1111-4111-8111-111111111111', 'ed111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 1, 25.50, 0.00, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'LOTE001', '2026-12-31', NOW(), NOW()),
('2f222222-2222-4222-8222-222222222222', 'ed111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab', 1, 20.00, 0.00, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'LOTE002', '2026-12-31', NOW(), NOW()),
('3f333333-3333-4333-8333-333333333333', 'ed222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 2, 25.50, 0.00, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'LOTE003', '2026-12-31', NOW(), NOW()),
('4f444444-4444-4444-8444-444444444444', 'ed222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaad', 1, 45.99, 0.00, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'LOTE004', '2026-12-31', NOW(), NOW());

-- Despachos
INSERT INTO despachos (id, "pedidoId", bodega, "horaSalida", "ventanaPrometidaInicio", "ventanaPrometidaFin", "createdAt", "updatedAt") VALUES
('de511111-1111-4111-8111-111111111111', 'ed222222-2222-4222-8222-222222222222', 'Bodega Central', '2026-02-03 14:00:00', '2026-02-03 15:00:00', '2026-02-03 17:00:00', NOW(), NOW());

-- Disponibilidad Zona
INSERT INTO disponibilidad_zona (id, "catalogoId", "productoId", "cantidadDisponible", "ultimaActualizacion", "createdAt", "updatedAt") VALUES
('d2111111-1111-4111-8111-111111111111', 'ca711111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 100, NOW(), NOW(), NOW()),
('d2222222-2222-4222-8222-222222222222', 'ca711111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab', 50, NOW(), NOW(), NOW()),
('d2333333-3333-4333-8333-333333333333', 'ca722222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 75, NOW(), NOW(), NOW()),
('d2444444-4444-4444-8444-444444444444', 'ca722222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaad', 150, NOW(), NOW(), NOW());

-- Notas de Crédito
INSERT INTO notas_credito (id, "pedidoId", "numeroDocumento", fecha, motivo, monto, "monedaId", evidencia, "createdAt", "updatedAt") VALUES
('a0c11111-1111-4111-8111-111111111111', 'ed111111-1111-4111-8111-111111111111', 'NC-001', '2026-02-04', 'productoVencido', 5.50, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Producto vencido en entrega', NOW(), NOW());
