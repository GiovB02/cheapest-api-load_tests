import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients/tienda.client.mock';
import { CreateRegistroCompraDto } from '../dtos/registro-compra/create-registro-compra.dto';
import { QueryRegistroCompraDto } from '../dtos/registro-compra/query-registro-compra.dto';
import { UpdateRegistroCompraDto } from '../dtos/registro-compra/update-registro-compra.dto';
import { ItemInventario } from '../repositories/entities/item-inventario.entity';
import { RegistroCompraProductoTienda } from '../repositories/entities/registro-compra-producto-tienda.entity';
import { ItemInventarioRepository } from '../repositories/item-inventario.repository';
import { RegistroCompraRepository } from '../repositories/registro-compra.repository';
import { RegistroCompraService } from './registro-compra.service';

describe('RegistroCompraService', () => {
  let service: RegistroCompraService;
  let registroRepo: jest.Mocked<RegistroCompraRepository>;
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
      incrementCantidad: jest.fn(),
      decrementCantidad: jest.fn(),
    };
    const mockProductoClient = {
      exists: jest.fn(),
    };
    const mockTiendaClient = {
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistroCompraService,
        {
          provide: RegistroCompraRepository,
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

    service = module.get<RegistroCompraService>(RegistroCompraService);
    registroRepo = module.get(RegistroCompraRepository);
    itemRepo = module.get(ItemInventarioRepository);
    productoService = module.get(ProductoService);
    tiendaClient = module.get(TiendaClientMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create registro and increment inventory', async () => {
      const dto: CreateRegistroCompraDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
      };
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 5,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };
      const registro: RegistroCompraProductoTienda = {
        id: 'reg-1',
        ...dto,
        itemInventario: item,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      itemRepo.findById.mockResolvedValue(item);
      registroRepo.create.mockResolvedValue(registro);
      itemRepo.incrementCantidad.mockResolvedValue(undefined);

      const result = await service.create(dto);

      expect(productoService.exists).toHaveBeenCalledWith(dto.productoId);
      expect(tiendaClient.exists).toHaveBeenCalledWith(dto.tiendaId);
      expect(itemRepo.findById).toHaveBeenCalledWith(dto.itemInventarioId);
      expect(registroRepo.create).toHaveBeenCalledWith(dto);
      expect(itemRepo.incrementCantidad).toHaveBeenCalledWith(
        dto.itemInventarioId,
        dto.cantidad,
      );
      expect(result).toEqual({
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: expect.any(Date),
        cantidad: 10,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw if producto does not exist', async () => {
      const dto: CreateRegistroCompraDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
      };

      productoService.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if tienda does not exist', async () => {
      const dto: CreateRegistroCompraDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if item does not exist', async () => {
      const dto: CreateRegistroCompraDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
      };

      productoService.exists.mockResolvedValue(true);
      tiendaClient.exists.mockResolvedValue(true);
      itemRepo.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if item producto does not match', async () => {
      const dto: CreateRegistroCompraDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
      };
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-2',
        tiendaId: 'tienda-1',
        cantidad: 5,
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
      const dto: CreateRegistroCompraDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
      };
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-2',
        cantidad: 5,
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
      const query: QueryRegistroCompraDto = {};
      const registros: RegistroCompraProductoTienda[] = [
        {
          id: 'reg-1',
          tiendaId: 'tienda-1',
          productoId: 'prod-1',
          compraId: 'compra-1',
          itemInventarioId: 'item-1',
          fechaCompra: new Date(),
          cantidad: 10,
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
      const registro: RegistroCompraProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
        itemInventario: {} as ItemInventario,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      const dto: UpdateRegistroCompraDto = { cantidad: 20 };
      const registro: RegistroCompraProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemInventario: {} as ItemInventario,
      };
      const updatedRegistro: RegistroCompraProductoTienda = {
        ...registro,
        cantidad: 20,
      };

      registroRepo.findById.mockResolvedValue(registro);
      registroRepo.update.mockResolvedValue(updatedRegistro);

      const result = await service.update('reg-1', dto);

      expect(registroRepo.findById).toHaveBeenCalledWith('reg-1');
      expect(registroRepo.update).toHaveBeenCalledWith('reg-1', dto);
      expect(result.cantidad).toBe(20);
    });

    it('should throw NotFoundException if not found', async () => {
      registroRepo.findById.mockResolvedValue(null);

      await expect(service.update('reg-1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should decrement inventory and delete registro', async () => {
      const registro: RegistroCompraProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
        itemInventario: {} as ItemInventario,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      registroRepo.findById.mockResolvedValue(registro);
      itemRepo.decrementCantidad.mockResolvedValue(undefined);
      registroRepo.delete.mockResolvedValue(true);

      await service.delete('reg-1');

      expect(registroRepo.findById).toHaveBeenCalledWith('reg-1');
      expect(itemRepo.decrementCantidad).toHaveBeenCalledWith('item-1', 10);
      expect(registroRepo.delete).toHaveBeenCalledWith('reg-1');
    });

    it('should throw NotFoundException if not found', async () => {
      registroRepo.findById.mockResolvedValue(null);

      await expect(service.delete('reg-1')).rejects.toThrow(NotFoundException);
    });
  });
});
