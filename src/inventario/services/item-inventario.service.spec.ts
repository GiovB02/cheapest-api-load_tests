import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients/tienda.client.mock';
import { CreateItemInventarioDto } from '../dtos/item-inventario/create-item-inventario.dto';
import { QueryItemInventarioDto } from '../dtos/item-inventario/query-item-inventario.dto';
import { UpdateItemInventarioDto } from '../dtos/item-inventario/update-item-inventario.dto';
import { ItemInventario } from '../repositories/entities/item-inventario.entity';
import { ItemInventarioRepository } from '../repositories/item-inventario.repository';
import { ItemInventarioService } from './item-inventario.service';

describe('ItemInventarioService', () => {
  let service: ItemInventarioService;
  let repository: jest.Mocked<ItemInventarioRepository>;
  let productoService: jest.Mocked<ProductoService>;
  let tiendaClient: jest.Mocked<TiendaClientMock>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockProductoClient = {
      exists: jest.fn(),
    };
    const mockTiendaClient = {
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemInventarioService,
        {
          provide: ItemInventarioRepository,
          useValue: mockRepository,
        },
        {
          provide: ProductoService,
          useValue: mockProductoClient,
        },
        {
          provide: TiendaClientMock,
          useValue: mockTiendaClient,
        },
      ],
    }).compile();

    service = module.get<ItemInventarioService>(ItemInventarioService);
    repository = module.get(ItemInventarioRepository);
    productoService = module.get(ProductoService);
    tiendaClient = module.get(TiendaClientMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create item when producto and tienda exist', async () => {
      const dto: CreateItemInventarioDto = {
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
      };
      const item: ItemInventario = {
        id: 'item-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      repository.create.mockResolvedValue(item);

      const result = await service.create(dto);

      expect(productoService.exists).toHaveBeenCalledWith(dto.productoId);
      expect(tiendaClient.exists).toHaveBeenCalledWith(dto.tiendaId);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw BadRequestException if producto does not exist', async () => {
      const dto: CreateItemInventarioDto = {
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
      };

      productoService.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(productoService.exists).toHaveBeenCalledWith(dto.productoId);
    });

    it('should throw BadRequestException if tienda does not exist', async () => {
      const dto: CreateItemInventarioDto = {
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(tiendaClient.exists).toHaveBeenCalledWith(dto.tiendaId);
    });
  });

  describe('findAll', () => {
    it('should return mapped items', async () => {
      const query: QueryItemInventarioDto = {};
      const items: ItemInventario[] = [
        {
          id: 'item-1',
          productoId: 'prod-1',
          tiendaId: 'tienda-1',
          cantidad: 10,
          precioVenta: 100,
          monedaId: 'usd',
          createdAt: new Date(),
          updatedAt: new Date(),
          registrosVenta: [],
          registrosCompra: [],
        },
      ];

      repository.findAll.mockResolvedValue(items);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findById', () => {
    it('should return mapped item if found', async () => {
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      repository.findById.mockResolvedValue(item);

      const result = await service.findById('item-1');

      expect(repository.findById).toHaveBeenCalledWith('item-1');
      expect(result).toEqual({
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('item-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return mapped item', async () => {
      const dto: UpdateItemInventarioDto = { cantidad: 20 };
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };
      const updatedItem: ItemInventario = { ...item, cantidad: 20 };

      repository.findById.mockResolvedValue(item);
      repository.update.mockResolvedValue(updatedItem);

      const result = await service.update('item-1', dto);

      expect(repository.findById).toHaveBeenCalledWith('item-1');
      expect(repository.update).toHaveBeenCalledWith('item-1', dto);
      expect(result.cantidad).toBe(20);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('item-1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete if found', async () => {
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      repository.findById.mockResolvedValue(item);
      repository.delete.mockResolvedValue(true);

      await service.delete('item-1');

      expect(repository.findById).toHaveBeenCalledWith('item-1');
      expect(repository.delete).toHaveBeenCalledWith('item-1');
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('item-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkDisponibilidad', () => {
    it('should return true if quantity sufficient', async () => {
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      repository.findById.mockResolvedValue(item);

      const result = await service.checkDisponibilidad('item-1', 5);

      expect(result).toBe(true);
    });

    it('should return false if quantity insufficient', async () => {
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      repository.findById.mockResolvedValue(item);

      const result = await service.checkDisponibilidad('item-1', 15);

      expect(result).toBe(false);
    });

    it('should return false if item not found', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.checkDisponibilidad('item-1', 5);

      expect(result).toBe(false);
    });
  });
});
