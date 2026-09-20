import { Test, TestingModule } from '@nestjs/testing';
import { CreateRegistroVentaDto } from '../dtos/registro-venta/create-registro-venta.dto';
import { QueryRegistroVentaDto } from '../dtos/registro-venta/query-registro-venta.dto';
import { RegistroVentaResponseDto } from '../dtos/registro-venta/registro-venta-response.dto';
import { UpdateRegistroVentaDto } from '../dtos/registro-venta/update-registro-venta.dto';
import { RegistroVentaService } from '../services/registro-venta.service';
import { RegistroVentaController } from './registro-venta.controller';

describe('RegistroVentaController', () => {
  let controller: RegistroVentaController;
  let service: jest.Mocked<RegistroVentaService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroVentaController],
      providers: [
        {
          provide: RegistroVentaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RegistroVentaController>(RegistroVentaController);
    service = module.get(RegistroVentaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };
      const response: RegistroVentaResponseDto = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
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
      const query: QueryRegistroVentaDto = { tiendaId: 'tienda-1' };
      const response: RegistroVentaResponseDto[] = [];
      service.findAll.mockResolvedValue(response);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      const id = 'reg-1';
      const response: RegistroVentaResponseDto = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.findById.mockResolvedValue(response);

      const result = await controller.findById(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const id = 'reg-1';
      const dto: UpdateRegistroVentaDto = { cantidad: 10 };
      const response: RegistroVentaResponseDto = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.update.mockResolvedValue(response);

      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      const id = 'reg-1';
      service.delete.mockResolvedValue(undefined);

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
