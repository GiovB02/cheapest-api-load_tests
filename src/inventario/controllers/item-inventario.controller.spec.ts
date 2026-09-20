import { Test, TestingModule } from '@nestjs/testing';
import { CreateItemInventarioDto } from '../dtos/item-inventario/create-item-inventario.dto';
import { ItemInventarioResponseDto } from '../dtos/item-inventario/item-inventario-response.dto';
import { QueryItemInventarioDto } from '../dtos/item-inventario/query-item-inventario.dto';
import { UpdateItemInventarioDto } from '../dtos/item-inventario/update-item-inventario.dto';
import { ItemInventarioService } from '../services/item-inventario.service';
import { ItemInventarioController } from './item-inventario.controller';

describe('ItemInventarioController', () => {
  let controller: ItemInventarioController;
  let service: jest.Mocked<ItemInventarioService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemInventarioController],
      providers: [
        {
          provide: ItemInventarioService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ItemInventarioController>(ItemInventarioController);
    service = module.get(ItemInventarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateItemInventarioDto = {
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
      };
      const response: ItemInventarioResponseDto = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
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
      const query: QueryItemInventarioDto = { tiendaId: 'tienda-1' };
      const response: ItemInventarioResponseDto[] = [];
      service.findAll.mockResolvedValue(response);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      const id = 'item-1';
      const response: ItemInventarioResponseDto = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
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
      const id = 'item-1';
      const dto: UpdateItemInventarioDto = { cantidad: 20 };
      const response: ItemInventarioResponseDto = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 20,
        precioVenta: 100,
        monedaId: 'usd',
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
      const id = 'item-1';
      service.delete.mockResolvedValue(undefined);

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
