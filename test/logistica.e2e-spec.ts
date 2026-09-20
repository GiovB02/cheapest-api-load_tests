import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Logistica (e2e)', () => {
  let app: INestApplication<App>;
  let testProductoId: string;
  let testCatalogoId: string;
  let testPedidoId: string;
  let testDespachoId: string;

  const tiendaId = '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9'; // Mock tienda ID
  const monedaId = '550e8400-e29b-41d4-a716-446655440000';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create test producto
    const productoResponse = await request(app.getHttpServer())
      .post('/logistics/productos')
      .send({
        codigoInterno: 'TEST-PROD-001',
        codigoBarras: '1234567890123',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: 'Unidad',
        precioBase: 100.0,
        monedaId: monedaId,
      });

    testProductoId = productoResponse.body.id;
  });

  afterAll(async () => {
    if (app && testProductoId) {
      await request(app.getHttpServer())
        .delete(`/logistics/productos/${testProductoId}`)
        .catch(() => {}); // Ignore errors during cleanup
    }
    if (app) {
      await app.close();
    }
  });

  describe('Producto', () => {
    it('should create a producto', () => {
      return request(app.getHttpServer())
        .post('/logistics/productos')
        .send({
          codigoInterno: 'TEST-PROD-002',
          codigoBarras: '1234567890124',
          nombre: 'Producto Test 2',
          marca: 'Marca Test',
          categoria: 'Categoria Test',
          presentacion: 'Unidad',
          precioBase: 50.0,
          monedaId: monedaId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nombre).toBe('Producto Test 2');
          expect(res.body.precioBase).toBe(50.0);
        });
    });

    it('should get all productos', () => {
      return request(app.getHttpServer())
        .get('/logistics/productos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get producto by id', () => {
      return request(app.getHttpServer())
        .get(`/logistics/productos/${testProductoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testProductoId);
        });
    });

    it('should update producto', () => {
      return request(app.getHttpServer())
        .patch(`/logistics/productos/${testProductoId}`)
        .send({
          nombre: 'Producto Updated',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).toBe('Producto Updated');
        });
    });

    it('should delete producto', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/logistics/productos')
        .send({
          codigoInterno: 'TEST-PROD-DEL',
          codigoBarras: '1234567890125',
          nombre: 'Producto Delete',
          marca: 'Marca Test',
          categoria: 'Categoria Test',
          presentacion: 'Unidad',
          precioBase: 30.0,
          monedaId: monedaId,
        });

      const productoId = createRes.body.id;

      return request(app.getHttpServer())
        .delete(`/logistics/productos/${productoId}`)
        .expect(200);
    });
  });

  describe('Catalogo', () => {
    it('should create a catalogo', () => {
      return request(app.getHttpServer())
        .post('/logistics/catalogos')
        .send({
          tiendaId: tiendaId,
          vigenciaDesde: '2024-01-01',
          vigenciaHasta: '2024-12-31',
          zona: 'ZONA_NORTE',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.tiendaId).toBe(tiendaId);
          expect(res.body.zona).toBe('ZONA_NORTE');
          testCatalogoId = res.body.id;
        });
    });

    it('should get all catalogos', () => {
      return request(app.getHttpServer())
        .get('/logistics/catalogos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get catalogo by id', () => {
      return request(app.getHttpServer())
        .get(`/logistics/catalogos/${testCatalogoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testCatalogoId);
        });
    });

    it('should update catalogo', () => {
      return request(app.getHttpServer())
        .patch(`/logistics/catalogos/${testCatalogoId}`)
        .send({
          zona: 'ZONA_SUR',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.zona).toBe('ZONA_SUR');
        });
    });
  });

  describe('Pedido', () => {
    it('should create a pedido', () => {
      return request(app.getHttpServer())
        .post('/logistics/pedidos')
        .send({
          identificador: 'PED-001',
          tiendaId: tiendaId,
          fechaHoraCreacion: new Date().toISOString(),
          montoTotal: 1000.0,
          monedaId: monedaId,
          estado: 'creado',
          items: [
            {
              productoId: testProductoId,
              cantidad: 2,
              precioUnitario: 500.0,
              descuento: 0,
              monedaId: monedaId,
            },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.identificador).toBe('PED-001');
          expect(res.body.estado).toBe('creado');
          testPedidoId = res.body.id;
        });
    });

    it('should get all pedidos', () => {
      return request(app.getHttpServer())
        .get('/logistics/pedidos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get pedido by id', () => {
      return request(app.getHttpServer())
        .get(`/logistics/pedidos/${testPedidoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testPedidoId);
        });
    });

    it('should update pedido', () => {
      return request(app.getHttpServer())
        .patch(`/logistics/pedidos/${testPedidoId}`)
        .send({
          estado: 'aprobado',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.estado).toBe('aprobado');
        });
    });
  });

  describe('Despacho', () => {
    it('should create a despacho', () => {
      return request(app.getHttpServer())
        .post('/logistics/despachos')
        .send({
          pedidoId: testPedidoId,
          bodega: 'BODEGA_A',
          horaSalida: new Date().toISOString(),
          ventanaPrometidaInicio: new Date(
            Date.now() + 4 * 60 * 60 * 1000,
          ).toISOString(),
          ventanaPrometidaFin: new Date(
            Date.now() + 8 * 60 * 60 * 1000,
          ).toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.pedidoId).toBe(testPedidoId);
          expect(res.body.bodega).toBe('BODEGA_A');
          testDespachoId = res.body.id;
        });
    });

    it('should get all despachos', () => {
      return request(app.getHttpServer())
        .get('/logistics/despachos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get despacho by id', () => {
      return request(app.getHttpServer())
        .get(`/logistics/despachos/${testDespachoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testDespachoId);
        });
    });

    it('should update despacho', () => {
      return request(app.getHttpServer())
        .patch(`/logistics/despachos/${testDespachoId}`)
        .send({
          bodega: 'BODEGA_B',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.bodega).toBe('BODEGA_B');
        });
    });

    it('should delete despacho', () => {
      return request(app.getHttpServer())
        .delete(`/logistics/despachos/${testDespachoId}`)
        .expect(200);
    });
  });

  describe('Disponibilidad Zona', () => {
    let disponibilidadZonaId: string;

    it('should create disponibilidad zona', () => {
      return request(app.getHttpServer())
        .post('/logistics/disponibilidad-zona')
        .send({
          catalogoId: testCatalogoId,
          productoId: testProductoId,
          cantidadDisponible: 100,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.catalogoId).toBe(testCatalogoId);
          expect(res.body.productoId).toBe(testProductoId);
          expect(res.body.cantidadDisponible).toBe(100);
          disponibilidadZonaId = res.body.id;
        });
    });

    it('should get all disponibilidad zonas', () => {
      return request(app.getHttpServer())
        .get('/logistics/disponibilidad-zona')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get disponibilidad zona by id', () => {
      return request(app.getHttpServer())
        .get(`/logistics/disponibilidad-zona/${disponibilidadZonaId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(disponibilidadZonaId);
        });
    });

    it('should update disponibilidad zona', () => {
      return request(app.getHttpServer())
        .patch(`/logistics/disponibilidad-zona/${disponibilidadZonaId}`)
        .send({
          cantidadDisponible: 50,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.cantidadDisponible).toBe(50);
        });
    });

    it('should delete disponibilidad zona', () => {
      return request(app.getHttpServer())
        .delete(`/logistics/disponibilidad-zona/${disponibilidadZonaId}`)
        .expect(200);
    });
  });

  describe('Nota Credito', () => {
    let notaCreditoId: string;

    it('should create nota credito', () => {
      return request(app.getHttpServer())
        .post('/logistics/notas-credito')
        .send({
          pedidoId: testPedidoId,
          numeroDocumento: 'NC-001',
          fecha: new Date().toISOString().split('T')[0],
          motivo: 'productoVencido',
          monto: 100.0,
          monedaId: monedaId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.pedidoId).toBe(testPedidoId);
          expect(res.body.motivo).toBe('productoVencido');
          notaCreditoId = res.body.id;
        });
    });

    it('should get all notas credito', () => {
      return request(app.getHttpServer())
        .get('/logistics/notas-credito')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get nota credito by id', () => {
      return request(app.getHttpServer())
        .get(`/logistics/notas-credito/${notaCreditoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(notaCreditoId);
        });
    });

    it('should update nota credito', () => {
      return request(app.getHttpServer())
        .patch(`/logistics/notas-credito/${notaCreditoId}`)
        .send({
          motivo: 'productoEquivocado',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.motivo).toBe('productoEquivocado');
        });
    });

    it('should delete nota credito', () => {
      return request(app.getHttpServer())
        .delete(`/logistics/notas-credito/${notaCreditoId}`)
        .expect(200);
    });
  });

  describe('Promocion', () => {
    let promocionId: string;

    it('should create promocion', () => {
      return request(app.getHttpServer())
        .post('/logistics/promociones')
        .send({
          nombre: 'Promoción descuento 10%',
          precioPromocional: 90.0,
          monedaId: monedaId,
          productoId: testProductoId,
          tiendaIds: [tiendaId],
          inicio: new Date().toISOString(),
          fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          restricciones: 0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nombre).toBe('Promoción descuento 10%');
          expect(res.body.precioPromocional).toBe(90.0);
          expect(res.body.productoId).toBe(testProductoId);
          promocionId = res.body.id;
        });
    });

    it('should get all promociones', () => {
      return request(app.getHttpServer())
        .get('/logistics/promociones')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get promocion by id', () => {
      return request(app.getHttpServer())
        .get(`/logistics/promociones/${promocionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(promocionId);
        });
    });

    it('should update promocion', () => {
      return request(app.getHttpServer())
        .patch(`/logistics/promociones/${promocionId}`)
        .send({
          nombre: 'Promoción descuento actualizada',
          precioPromocional: 85.0,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nombre).toBe('Promoción descuento actualizada');
          expect(res.body.precioPromocional).toBe(85.0);
        });
    });

    it('should delete promocion', () => {
      return request(app.getHttpServer())
        .delete(`/logistics/promociones/${promocionId}`)
        .expect(200);
    });
  });

  describe('Clean up', () => {
    it('should delete despacho if exists', async () => {
      if (testDespachoId) {
        await request(app.getHttpServer())
          .delete(`/logistics/despachos/${testDespachoId}`)
          .catch(() => {}); // Ignore errors
      }
    });

    it('should delete pedido', async () => {
      if (!testPedidoId) {
        return Promise.resolve();
      }
      // Try to delete, but ignore errors due to FK constraints
      await request(app.getHttpServer())
        .delete(`/logistics/pedidos/${testPedidoId}`)
        .catch(() => {}); // Ignore FK constraint errors
    });

    it('should delete catalogo', async () => {
      if (!testCatalogoId) {
        return Promise.resolve();
      }
      await request(app.getHttpServer())
        .delete(`/logistics/catalogos/${testCatalogoId}`)
        .catch(() => {}); // Ignore errors
    });
  });
});
