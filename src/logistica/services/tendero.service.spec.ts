import { Test, TestingModule } from '@nestjs/testing';
import { QueryProductosDisponiblesDto } from '../dtos';
import { ProductoRepository } from '../repositories';
import { TenderoService } from './tendero.service';

const TIENDA_ID = '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9';
const ZONA = 'Zona Norte';

const makeProducto = (id = 'prod-1') => ({
  id,
  codigoInterno: 'PI-001',
  codigoBarras: '1234567890',
  nombre: 'Producto Test',
  marca: 'Marca A',
  categoria: 'Categoría 1',
  presentacion: '500ml',
  precioBase: 10.5,
  monedaId: 'moneda-1',
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('TenderoService', () => {
  let service: TenderoService;
  let productoRepository: jest.Mocked<ProductoRepository>;

  beforeEach(async () => {
    const mockProductoRepository = {
      findProductosDisponiblesParaTendero: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenderoService,
        { provide: ProductoRepository, useValue: mockProductoRepository },
      ],
    }).compile();

    service = module.get<TenderoService>(TenderoService);
    productoRepository = module.get(ProductoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const dto: QueryProductosDisponiblesDto = { tiendaId: TIENDA_ID, zona: ZONA };

  describe('getProductosDisponibles', () => {
    it('should delegate to repository and map results', async () => {
      const producto = makeProducto();
      productoRepository.findProductosDisponiblesParaTendero.mockResolvedValue([
        producto as any,
      ]);

      const result = await service.getProductosDisponibles(dto);

      expect(
        productoRepository.findProductosDisponiblesParaTendero,
      ).toHaveBeenCalledWith(TIENDA_ID, ZONA);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: producto.id,
        codigoInterno: producto.codigoInterno,
        codigoBarras: producto.codigoBarras,
        nombre: producto.nombre,
        marca: producto.marca,
        categoria: producto.categoria,
        presentacion: producto.presentacion,
        precioBase: producto.precioBase,
        monedaId: producto.monedaId,
      });
    });

    it('should return empty array when repository returns no products', async () => {
      productoRepository.findProductosDisponiblesParaTendero.mockResolvedValue(
        [],
      );

      const result = await service.getProductosDisponibles(dto);

      expect(result).toHaveLength(0);
      expect(
        productoRepository.findProductosDisponiblesParaTendero,
      ).toHaveBeenCalledWith(TIENDA_ID, ZONA);
    });

    it('should map multiple products correctly', async () => {
      const productos = [makeProducto('prod-1'), makeProducto('prod-2')];
      productoRepository.findProductosDisponiblesParaTendero.mockResolvedValue(
        productos as any,
      );

      const result = await service.getProductosDisponibles(dto);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.id)).toEqual(['prod-1', 'prod-2']);
    });
  });
});
