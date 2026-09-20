import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateVentaDto,
  QueryVentaDto,
  UpdateVentaDto,
  VentaResponseDto,
} from '../dtos';
import { VentaService } from '../services';
import { VentaController } from './venta.controller';

describe('VentaController', () => {
  let controller: VentaController;
  let service: jest.Mocked<VentaService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentaController],
      providers: [
        {
          provide: VentaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VentaController>(VentaController);
    service = module.get(VentaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateVentaDto = {
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        monedaId: 'moneda-1',
        items: [
          {
            productoExternoId: 'prod-ext-1',
            cantidad: 2,
            precioUnitario: 25.5,
          },
        ],
      };
      const response: VentaResponseDto = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: dto.fechaHora,
        total: 51.0,
        monedaId: 'moneda-1',
        items: [
          {
            id: 'item-1',
            ventaId: 'venta-1',
            productoExternoId: 'prod-ext-1',
            cantidad: 2,
            precioUnitario: 25.5,
            monedaId: 'moneda-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: QueryVentaDto = { tiendaId: 'tienda-1' };
      const response: VentaResponseDto[] = [
        {
          id: 'venta-1',
          tiendaId: 'tienda-1',
          fechaHora: new Date(),
          total: 100.0,
          monedaId: 'moneda-1',
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      service.findAll.mockResolvedValue(response);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      const response: VentaResponseDto = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100.0,
        monedaId: 'moneda-1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.findById.mockResolvedValue(response);

      const result = await controller.findById('venta-1');

      expect(service.findById).toHaveBeenCalledWith('venta-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateVentaDto = {
        items: [
          {
            productoExternoId: 'prod-ext-1',
            cantidad: 5,
            precioUnitario: 20.0,
          },
        ],
      };
      const response: VentaResponseDto = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100.0,
        monedaId: 'moneda-1',
        items: [
          {
            id: 'item-1',
            ventaId: 'venta-1',
            productoExternoId: 'prod-ext-1',
            cantidad: 5,
            precioUnitario: 20.0,
            monedaId: 'moneda-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.update.mockResolvedValue(response);

      const result = await controller.update('venta-1', dto);

      expect(service.update).toHaveBeenCalledWith('venta-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('venta-1');

      expect(service.delete).toHaveBeenCalledWith('venta-1');
    });
  });
});
