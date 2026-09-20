import { Test, TestingModule } from '@nestjs/testing';
import { QueryProductosDisponiblesDto } from '../dtos';
import { TenderoService } from '../services';
import { TenderoController } from './tendero.controller';

const TIENDA_ID = '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9';
const ZONA = 'Zona Norte';

describe('TenderoController', () => {
  let controller: TenderoController;
  let service: jest.Mocked<TenderoService>;

  beforeEach(async () => {
    const mockService = {
      getProductosDisponibles: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderoController],
      providers: [{ provide: TenderoService, useValue: mockService }],
    }).compile();

    controller = module.get<TenderoController>(TenderoController);
    service = module.get(TenderoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProductosDisponibles', () => {
    it('should call service with the query dto and return its result', async () => {
      const query: QueryProductosDisponiblesDto = {
        tiendaId: TIENDA_ID,
        zona: ZONA,
      };
      const expected = [
        {
          id: 'prod-1',
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
        },
      ];

      service.getProductosDisponibles.mockResolvedValue(expected as any);

      const result = await controller.getProductosDisponibles(query);

      expect(result).toEqual(expected);
      expect(service.getProductosDisponibles).toHaveBeenCalledWith(query);
    });

    it('should return an empty array when no products match', async () => {
      const query: QueryProductosDisponiblesDto = {
        tiendaId: TIENDA_ID,
        zona: ZONA,
      };
      service.getProductosDisponibles.mockResolvedValue([]);

      const result = await controller.getProductosDisponibles(query);

      expect(result).toEqual([]);
      expect(service.getProductosDisponibles).toHaveBeenCalledWith(query);
    });
  });
});
