import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Inventario (e2e)', () => {
  let app: INestApplication<App>;
  let testProductoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a test producto
    const productoResponse = await request(app.getHttpServer())
      .post('/logistics/productos')
      .send({
        codigoInterno: 'TEST001',
        codigoBarras: '1234567890123',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: 'Unidad',
        precioBase: 10.0,
        monedaId: '550e8400-e29b-41d4-a716-446655440000',
      });

    testProductoId = productoResponse.body.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (app && testProductoId) {
      await request(app.getHttpServer())
        .delete(`/logistics/productos/${testProductoId}`)
        .catch(() => {}); // Ignore errors during cleanup
    }
    if (app) {
      await app.close();
    }
  });

  describe('Item Inventario', () => {
    it('should create an item', () => {
      return request(app.getHttpServer())
        .post('/inventory/items')
        .send({
          productoId: testProductoId, // Test producto
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9', // From tienda mock
          cantidad: 10,
          precioVenta: 100.5,
          monedaId: '550e8400-e29b-41d4-a716-446655440000',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.productoId).toBe(testProductoId);
          expect(res.body.tiendaId).toBe(
            '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          );
          expect(res.body.cantidad).toBe(10);
          expect(res.body.precioVenta).toBe(100.5);
          expect(res.body.monedaId).toBe(
            '550e8400-e29b-41d4-a716-446655440000',
          );
        });
    });

    it('should get all items', () => {
      return request(app.getHttpServer())
        .get('/inventory/items')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get item by id', async () => {
      // First create an item
      const createResponse = await request(app.getHttpServer())
        .post('/inventory/items')
        .send({
          productoId: testProductoId,
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          cantidad: 5,
          precioVenta: 50.0,
          monedaId: '550e8400-e29b-41d4-a716-446655440000',
        });

      const itemId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/inventory/items/${itemId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(itemId);
          expect(res.body.cantidad).toBe(5);
        });
    });

    it('should update an item', async () => {
      // First create an item
      const createResponse = await request(app.getHttpServer())
        .post('/inventory/items')
        .send({
          productoId: testProductoId,
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          cantidad: 10,
          precioVenta: 100.0,
          monedaId: '550e8400-e29b-41d4-a716-446655440000',
        });

      const itemId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/inventory/items/${itemId}`)
        .send({
          cantidad: 15,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(itemId);
          expect(res.body.cantidad).toBe(15);
        });
    });

    it('should delete an item', async () => {
      // First create an item
      const createResponse = await request(app.getHttpServer())
        .post('/inventory/items')
        .send({
          productoId: testProductoId,
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          cantidad: 10,
          precioVenta: 100.0,
          monedaId: '550e8400-e29b-41d4-a716-446655440000',
        });

      const itemId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/inventory/items/${itemId}`)
        .expect(200);
    });
  });

  describe('Registro Compra', () => {
    let itemId: string;

    beforeEach(async () => {
      // Create an item for compra
      const createResponse = await request(app.getHttpServer())
        .post('/inventory/items')
        .send({
          productoId: testProductoId,
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          cantidad: 10,
          precioVenta: 100.0,
          monedaId: '550e8400-e29b-41d4-a716-446655440000',
        });
      itemId = createResponse.body.id;
    });

    it('should create a compra', () => {
      return request(app.getHttpServer())
        .post('/inventory/compras')
        .send({
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          productoId: testProductoId,
          compraId: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
          itemInventarioId: itemId,
          fechaCompra: '2023-01-01T00:00:00.000Z',
          cantidad: 5,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.compraId).toBe(
            '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
          );
          expect(res.body.cantidad).toBe(5);
        });
    });

    it('should get all compras', () => {
      return request(app.getHttpServer())
        .get('/inventory/compras')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Registro Venta', () => {
    let itemId: string;

    beforeEach(async () => {
      // Create an item for venta
      const createResponse = await request(app.getHttpServer())
        .post('/inventory/items')
        .send({
          productoId: testProductoId,
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          cantidad: 10,
          precioVenta: 100.0,
          monedaId: '550e8400-e29b-41d4-a716-446655440000',
        });
      itemId = createResponse.body.id;
    });

    it('should create a venta', () => {
      return request(app.getHttpServer())
        .post('/inventory/ventas')
        .send({
          tiendaId: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
          productoId: testProductoId,
          ventaId: '6ba7b811-9dad-41d1-80b4-00c04fd430c8',
          itemInventarioId: itemId,
          fechaVenta: '2023-01-01T00:00:00.000Z',
          cantidad: 3,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.ventaId).toBe('6ba7b811-9dad-41d1-80b4-00c04fd430c8');
          expect(res.body.cantidad).toBe(3);
        });
    });

    it('should get all ventas', () => {
      return request(app.getHttpServer())
        .get('/inventory/ventas')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
