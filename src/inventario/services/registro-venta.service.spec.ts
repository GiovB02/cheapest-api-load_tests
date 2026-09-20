import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients/tienda.client.mock';
import { CreateRegistroVentaDto } from '../dtos/registro-venta/create-registro-venta.dto';
import { QueryRegistroVentaDto } from '../dtos/registro-venta/query-registro-venta.dto';
import { UpdateRegistroVentaDto } from '../dtos/registro-venta/update-registro-venta.dto';
import { ItemInventario } from '../repositories/entities/item-inventario.entity';
import { RegistroVentaProductoTienda } from '../repositories/entities/registro-venta-producto-tienda.entity';
import { ItemInventarioRepository } from '../repositories/item-inventario.repository';
import { RegistroVentaRepository } from '../repositories/registro-venta.repository';
import { RegistroVentaService } from './registro-venta.service';

describe('RegistroVentaService', () => {
  let service: RegistroVentaService;
  let registroRepo: jest.Mocked<RegistroVentaRepository>;
  let itemRepo: jest.Mocked<ItemInventarioRepository>;
  let productoService: jest.Mocked<ProductoService>;
  let tiendaClient: jest.Mocked<TiendaClientMock>;

  beforeEach(async () => {
    const mockRegistroRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockItemRepo = {
      findById: jest.fn(),
      decrementCantidad: jest.fn(),
      incrementCantidad: jest.fn(),
    };
    const mockProductoClient = {
      exists: jest.fn(),
    };
    const mockTiendaClient = {
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistroVentaService,
        {
          provide: RegistroVentaRepository,
          useValue: mockRegistroRepo,
        },
        {
          provide: ItemInventarioRepository,
          useValue: mockItemRepo,
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

    service = module.get<RegistroVentaService>(RegistroVentaService);
    registroRepo = module.get(RegistroVentaRepository);
    itemRepo = module.get(ItemInventarioRepository);
    productoService = module.get(ProductoService);
    tiendaClient = module.get(TiendaClientMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create registro and decrement inventory if sufficient quantity', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };
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
      const registro: RegistroVentaProductoTienda = {
        id: 'reg-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemInventarioId: 'item-1',
        itemInventario: item,
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      itemRepo.findById.mockResolvedValue(item);
      registroRepo.create.mockResolvedValue(registro);
      itemRepo.decrementCantidad.mockResolvedValue(undefined);

      const result = await service.create(dto);

      expect(productoService.exists).toHaveBeenCalledWith(dto.productoId);
      expect(tiendaClient.exists).toHaveBeenCalledWith(dto.tiendaId);
      expect(itemRepo.findById).toHaveBeenCalledWith(dto.itemInventarioId);
      expect(registroRepo.create).toHaveBeenCalledWith(dto);
      expect(itemRepo.decrementCantidad).toHaveBeenCalledWith(
        dto.itemInventarioId,
        dto.cantidad,
      );
      expect(result).toEqual({
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: expect.any(Date),
        cantidad: 5,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw if producto does not exist', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };

      productoService.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if tienda does not exist', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if item does not exist', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      itemRepo.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if item producto does not match', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-2',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      itemRepo.findById.mockResolvedValue(item);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if item tienda does not match', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-2',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      itemRepo.findById.mockResolvedValue(item);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if insufficient quantity', async () => {
      const dto: CreateRegistroVentaDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 15,
      };
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

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      itemRepo.findById.mockResolvedValue(item);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return mapped registros', async () => {
      const query: QueryRegistroVentaDto = {};
      const registros: RegistroVentaProductoTienda[] = [
        {
          id: 'reg-1',
          tiendaId: 'tienda-1',
          productoId: 'prod-1',
          ventaId: 'venta-1',
          itemInventarioId: 'item-1',
          fechaVenta: new Date(),
          cantidad: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemInventario: {} as ItemInventario,
        },
      ];

      registroRepo.findAll.mockResolvedValue(registros);

      const result = await service.findAll(query);

      expect(registroRepo.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return mapped registro if found', async () => {
      const registro: RegistroVentaProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemInventario: {} as ItemInventario,
      };

      registroRepo.findById.mockResolvedValue(registro);

      const result = await service.findById('reg-1');

      expect(registroRepo.findById).toHaveBeenCalledWith('reg-1');
      expect(result.id).toBe('reg-1');
    });

    it('should throw NotFoundException if not found', async () => {
      registroRepo.findById.mockResolvedValue(null);

      await expect(service.findById('reg-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return mapped registro', async () => {
      const dto: UpdateRegistroVentaDto = { cantidad: 10 };
      const registro: RegistroVentaProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemInventario: {} as ItemInventario,
      };
      const updatedRegistro: RegistroVentaProductoTienda = {
        ...registro,
        cantidad: 10,
      };

      registroRepo.findById.mockResolvedValue(registro);
      registroRepo.update.mockResolvedValue(updatedRegistro);

      const result = await service.update('reg-1', dto);

      expect(registroRepo.findById).toHaveBeenCalledWith('reg-1');
      expect(registroRepo.update).toHaveBeenCalledWith('reg-1', dto);
      expect(result.cantidad).toBe(10);
    });

    it('should throw NotFoundException if not found', async () => {
      registroRepo.findById.mockResolvedValue(null);

      await expect(service.update('reg-1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should increment inventory and delete registro', async () => {
      const registro: RegistroVentaProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemInventario: {} as ItemInventario,
      };

      registroRepo.findById.mockResolvedValue(registro);
      itemRepo.incrementCantidad.mockResolvedValue(undefined);
      registroRepo.delete.mockResolvedValue(true);

      await service.delete('reg-1');

      expect(registroRepo.findById).toHaveBeenCalledWith('reg-1');
      expect(itemRepo.incrementCantidad).toHaveBeenCalledWith('item-1', 5);
      expect(registroRepo.delete).toHaveBeenCalledWith('reg-1');
    });

    it('should throw NotFoundException if not found', async () => {
      registroRepo.findById.mockResolvedValue(null);

      await expect(service.delete('reg-1')).rejects.toThrow(NotFoundException);
    });
  });
});
