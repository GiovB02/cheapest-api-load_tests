import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients';
import { CreateVentaDto, QueryVentaDto, UpdateVentaDto } from '../dtos';
import { ItemVenta } from '../repositories/entities/item-venta.entity';
import { Venta } from '../repositories/entities/venta.entity';
import { ProductoExternoRepository } from '../repositories/producto-externo.repository';
import { VentaRepository } from '../repositories/venta.repository';
import { VentaService } from './venta.service';

describe('VentaService', () => {
  let service: VentaService;
  let ventaRepository: jest.Mocked<VentaRepository>;
  let productoExternoRepository: jest.Mocked<ProductoExternoRepository>;
  let tiendaClient: jest.Mocked<TiendaClientMock>;
  let productoService: jest.Mocked<ProductoService>;

  beforeEach(async () => {
    const mockVentaRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockProductoExternoRepository = {
      findById: jest.fn(),
    };
    const mockTiendaClient = {
      exists: jest.fn(),
    };
    const mockProductoService = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentaService,
        {
          provide: VentaRepository,
          useValue: mockVentaRepository,
        },
        {
          provide: ProductoExternoRepository,
          useValue: mockProductoExternoRepository,
        },
        {
          provide: TiendaClientMock,
          useValue: mockTiendaClient,
        },
        {
          provide: ProductoService,
          useValue: mockProductoService,
        },
      ],
    }).compile();

    service = module.get<VentaService>(VentaService);
    ventaRepository = module.get(VentaRepository);
    productoExternoRepository = module.get(ProductoExternoRepository);
    tiendaClient = module.get(TiendaClientMock);
    productoService = module.get(ProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create venta with calculated total', async () => {
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
          {
            productoExternoId: 'prod-ext-2',
            cantidad: 3,
            precioUnitario: 10.0,
          },
        ],
      };

      const expectedTotal = 2 * 25.5 + 3 * 10.0; // 81.0

      const createdVenta: Venta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: dto.fechaHora,
        total: expectedTotal,
        monedaId: 'moneda-1',
        items: [
          {
            id: 'item-1',
            ventaId: 'venta-1',
            productoExternoId: 'prod-ext-1',
            productoId: null,
            cantidad: 2,
            precioUnitario: 25.5,
            monedaId: 'moneda-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as ItemVenta,
          {
            id: 'item-2',
            ventaId: 'venta-1',
            productoExternoId: 'prod-ext-2',
            productoId: null,
            cantidad: 3,
            precioUnitario: 10.0,
            monedaId: 'moneda-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as ItemVenta,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      tiendaClient.exists.mockResolvedValue(true);
      productoExternoRepository.findById.mockResolvedValue({} as any);
      ventaRepository.create.mockResolvedValue(createdVenta);

      const result = await service.create(dto);

      expect(tiendaClient.exists).toHaveBeenCalledWith('tienda-1');
      expect(productoExternoRepository.findById).toHaveBeenCalledTimes(2);
      expect(ventaRepository.create).toHaveBeenCalled();
      expect(result.total).toBe(81.0);
      expect(result.items).toHaveLength(2);
    });

    it('should throw BadRequestException when tienda does not exist', async () => {
      const dto: CreateVentaDto = {
        tiendaId: 'non-existent',
        fechaHora: new Date(),
        monedaId: 'moneda-1',
        items: [
          {
            productoExternoId: 'prod-ext-1',
            cantidad: 1,
            precioUnitario: 10.0,
          },
        ],
      };

      tiendaClient.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'Tienda con id non-existent no existe',
      );
    });

    it('should throw BadRequestException when producto externo does not exist', async () => {
      const dto: CreateVentaDto = {
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        monedaId: 'moneda-1',
        items: [
          {
            productoExternoId: 'non-existent',
            cantidad: 1,
            precioUnitario: 10.0,
          },
        ],
      };

      tiendaClient.exists.mockResolvedValue(true);
      productoExternoRepository.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'ProductoExterno con id non-existent no existe',
      );
    });

    it('should create venta with productoId when provided and product exists', async () => {
      const dto: CreateVentaDto = {
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        monedaId: 'moneda-1',
        items: [
          {
            productoExternoId: 'prod-ext-1',
            productoId: 'producto-1',
            cantidad: 2,
            precioUnitario: 25.5,
          },
        ],
      };

      const createdVenta: Venta = {
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
            productoId: 'producto-1',
            cantidad: 2,
            precioUnitario: 25.5,
            monedaId: 'moneda-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as ItemVenta,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      tiendaClient.exists.mockResolvedValue(true);
      productoExternoRepository.findById.mockResolvedValue({} as any);
      productoService.findById.mockResolvedValue({} as any);
      ventaRepository.create.mockResolvedValue(createdVenta);

      const result = await service.create(dto);

      expect(productoService.findById).toHaveBeenCalledWith('producto-1');
      expect(result.items[0].productoId).toBe('producto-1');
    });

    it('should throw BadRequestException when productoId does not exist', async () => {
      const dto: CreateVentaDto = {
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        monedaId: 'moneda-1',
        items: [
          {
            productoExternoId: 'prod-ext-1',
            productoId: 'non-existent-producto',
            cantidad: 1,
            precioUnitario: 10.0,
          },
        ],
      };

      tiendaClient.exists.mockResolvedValue(true);
      productoExternoRepository.findById.mockResolvedValue({} as any);
      productoService.findById.mockRejectedValue(
        new NotFoundException('Producto no encontrado'),
      );

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'Producto con id non-existent-producto no existe',
      );
    });
  });

  describe('findAll', () => {
    it('should return all ventas', async () => {
      const query: QueryVentaDto = { tiendaId: 'tienda-1' };
      const ventas: Venta[] = [
        {
          id: 'venta-1',
          tiendaId: 'tienda-1',
          fechaHora: new Date(),
          total: 100,
          monedaId: 'moneda-1',
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      ventaRepository.findAll.mockResolvedValue(ventas);

      const result = await service.findAll(query);

      expect(ventaRepository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('venta-1');
    });
  });

  describe('findById', () => {
    it('should return venta when found', async () => {
      const venta: Venta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100,
        monedaId: 'moneda-1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ventaRepository.findById.mockResolvedValue(venta);

      const result = await service.findById('venta-1');

      expect(ventaRepository.findById).toHaveBeenCalledWith('venta-1');
      expect(result.id).toBe('venta-1');
    });

    it('should throw NotFoundException when venta not found', async () => {
      ventaRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('non-existent')).rejects.toThrow(
        'Venta con id non-existent no encontrada',
      );
    });
  });

  describe('update', () => {
    it('should update venta and recalculate total when items changed', async () => {
      const existingVenta: Venta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100,
        monedaId: 'moneda-1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto: UpdateVentaDto = {
        items: [
          {
            productoExternoId: 'prod-ext-1',
            cantidad: 5,
            precioUnitario: 20.0,
          },
        ],
      };

      const updatedVenta = {
        ...existingVenta,
        total: 100.0,
        items: [
          {
            id: 'item-1',
            productoExternoId: 'prod-ext-1',
            productoId: null,
            cantidad: 5,
            precioUnitario: 20.0,
          } as ItemVenta,
        ],
      };

      ventaRepository.findById.mockResolvedValue(existingVenta);
      productoExternoRepository.findById.mockResolvedValue({} as any);
      ventaRepository.update.mockResolvedValue(updatedVenta);

      const result = await service.update('venta-1', dto);

      expect(ventaRepository.findById).toHaveBeenCalledWith('venta-1');
      expect(productoExternoRepository.findById).toHaveBeenCalledWith(
        'prod-ext-1',
      );
      expect(ventaRepository.update).toHaveBeenCalled();
      expect(result.total).toBe(100.0);
    });

    it('should throw NotFoundException when venta not found', async () => {
      ventaRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { fechaHora: new Date() }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update only fechaHora without recalculating total', async () => {
      const existingVenta: Venta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100,
        monedaId: 'moneda-1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newFechaHora = new Date('2026-02-10');
      const dto: UpdateVentaDto = { fechaHora: newFechaHora };
      const updatedVenta = { ...existingVenta, fechaHora: newFechaHora };

      ventaRepository.findById.mockResolvedValue(existingVenta);
      ventaRepository.update.mockResolvedValue(updatedVenta);

      const result = await service.update('venta-1', dto);

      expect(result.fechaHora).toEqual(newFechaHora);
      expect(result.total).toBe(100);
    });

    it('should update venta with productoId when provided', async () => {
      const existingVenta: Venta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100,
        monedaId: 'moneda-1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto: UpdateVentaDto = {
        items: [
          {
            productoExternoId: 'prod-ext-1',
            productoId: 'producto-1',
            cantidad: 5,
            precioUnitario: 20.0,
          },
        ],
      };

      const updatedVenta = {
        ...existingVenta,
        total: 100.0,
        items: [
          {
            id: 'item-1',
            productoExternoId: 'prod-ext-1',
            productoId: 'producto-1',
            cantidad: 5,
            precioUnitario: 20.0,
          } as ItemVenta,
        ],
      };

      ventaRepository.findById.mockResolvedValue(existingVenta);
      productoExternoRepository.findById.mockResolvedValue({} as any);
      productoService.findById.mockResolvedValue({} as any);
      ventaRepository.update.mockResolvedValue(updatedVenta);

      const result = await service.update('venta-1', dto);

      expect(productoService.findById).toHaveBeenCalledWith('producto-1');
      expect(result.items[0].productoId).toBe('producto-1');
    });

    it('should throw BadRequestException when updating with invalid productoId', async () => {
      const existingVenta: Venta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100,
        monedaId: 'moneda-1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto: UpdateVentaDto = {
        items: [
          {
            productoExternoId: 'prod-ext-1',
            productoId: 'invalid-producto',
            cantidad: 5,
            precioUnitario: 20.0,
          },
        ],
      };

      ventaRepository.findById.mockResolvedValue(existingVenta);
      productoExternoRepository.findById.mockResolvedValue({} as any);
      productoService.findById.mockRejectedValue(
        new NotFoundException('Producto no encontrado'),
      );

      await expect(service.update('venta-1', dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update('venta-1', dto)).rejects.toThrow(
        'Producto con id invalid-producto no existe',
      );
    });
  });

  describe('delete', () => {
    it('should delete venta', async () => {
      const venta: Venta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100,
        monedaId: 'moneda-1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ventaRepository.findById.mockResolvedValue(venta);
      ventaRepository.delete.mockResolvedValue(true);

      await service.delete('venta-1');

      expect(ventaRepository.findById).toHaveBeenCalledWith('venta-1');
      expect(ventaRepository.delete).toHaveBeenCalledWith('venta-1');
    });

    it('should throw NotFoundException when venta not found', async () => {
      ventaRepository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
