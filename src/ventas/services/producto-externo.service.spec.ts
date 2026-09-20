import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TiendaClientMock } from '../clients';
import {
  CreateProductoExternoDto,
  QueryProductoExternoDto,
  UpdateProductoExternoDto,
} from '../dtos';
import { ProductoExterno } from '../repositories/entities/producto-externo.entity';
import { ProductoExternoRepository } from '../repositories/producto-externo.repository';
import { ProductoExternoService } from './producto-externo.service';

describe('ProductoExternoService', () => {
  let service: ProductoExternoService;
  let repository: jest.Mocked<ProductoExternoRepository>;
  let tiendaClient: jest.Mocked<TiendaClientMock>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockTiendaClient = {
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoExternoService,
        {
          provide: ProductoExternoRepository,
          useValue: mockRepository,
        },
        {
          provide: TiendaClientMock,
          useValue: mockTiendaClient,
        },
      ],
    }).compile();

    service = module.get<ProductoExternoService>(ProductoExternoService);
    repository = module.get(ProductoExternoRepository);
    tiendaClient = module.get(TiendaClientMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create producto externo when tienda exists', async () => {
      const dto: CreateProductoExternoDto = {
        tiendaId: 'tienda-1',
        codigoBarras: '1234567890',
        nombre: 'Producto Test',
        categoria: 'Bebidas',
        precioBase: 10.5,
        monedaId: 'moneda-1',
        cantidad: 100,
      };
      const producto: ProductoExterno = {
        id: 'prod-ext-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemsVenta: [],
      };

      tiendaClient.exists.mockResolvedValue(true);
      repository.create.mockResolvedValue(producto);

      const result = await service.create(dto);

      expect(tiendaClient.exists).toHaveBeenCalledWith('tienda-1');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 'prod-ext-1',
        tiendaId: 'tienda-1',
        codigoBarras: '1234567890',
        nombre: 'Producto Test',
        categoria: 'Bebidas',
        precioBase: 10.5,
        monedaId: 'moneda-1',
        cantidad: 100,
        createdAt: producto.createdAt,
        updatedAt: producto.updatedAt,
      });
    });

    it('should throw BadRequestException when tienda does not exist', async () => {
      const dto: CreateProductoExternoDto = {
        tiendaId: 'non-existent',
        codigoBarras: '1234567890',
        nombre: 'Producto Test',
        categoria: 'Bebidas',
        precioBase: 10.5,
        monedaId: 'moneda-1',
        cantidad: 100,
      };

      tiendaClient.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'Tienda con id non-existent no existe',
      );
    });
  });

  describe('findAll', () => {
    it('should return all productos externos', async () => {
      const query: QueryProductoExternoDto = { tiendaId: 'tienda-1' };
      const productos: ProductoExterno[] = [
        {
          id: 'prod-ext-1',
          tiendaId: 'tienda-1',
          codigoBarras: '123',
          nombre: 'Producto 1',
          categoria: 'Cat1',
          precioBase: 10,
          monedaId: 'mon-1',
          cantidad: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
          itemsVenta: [],
        },
      ];

      repository.findAll.mockResolvedValue(productos);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('prod-ext-1');
    });
  });

  describe('findById', () => {
    it('should return producto externo when found', async () => {
      const producto: ProductoExterno = {
        id: 'prod-ext-1',
        tiendaId: 'tienda-1',
        codigoBarras: '123',
        nombre: 'Producto 1',
        categoria: 'Cat1',
        precioBase: 10,
        monedaId: 'mon-1',
        cantidad: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemsVenta: [],
      };

      repository.findById.mockResolvedValue(producto);

      const result = await service.findById('prod-ext-1');

      expect(repository.findById).toHaveBeenCalledWith('prod-ext-1');
      expect(result.id).toBe('prod-ext-1');
    });

    it('should throw NotFoundException when producto not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('non-existent')).rejects.toThrow(
        'ProductoExterno con id non-existent no encontrado',
      );
    });
  });

  describe('update', () => {
    it('should update producto externo', async () => {
      const existingProducto: ProductoExterno = {
        id: 'prod-ext-1',
        tiendaId: 'tienda-1',
        codigoBarras: '123',
        nombre: 'Producto 1',
        categoria: 'Cat1',
        precioBase: 10,
        monedaId: 'mon-1',
        cantidad: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemsVenta: [],
      };
      const dto: UpdateProductoExternoDto = { precioBase: 15 };
      const updatedProducto = { ...existingProducto, precioBase: 15 };

      repository.findById.mockResolvedValue(existingProducto);
      repository.update.mockResolvedValue(updatedProducto);

      const result = await service.update('prod-ext-1', dto);

      expect(repository.findById).toHaveBeenCalledWith('prod-ext-1');
      expect(repository.update).toHaveBeenCalledWith('prod-ext-1', dto);
      expect(result.precioBase).toBe(15);
    });

    it('should throw NotFoundException when producto not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { precioBase: 15 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate new tiendaId if changed', async () => {
      const existingProducto: ProductoExterno = {
        id: 'prod-ext-1',
        tiendaId: 'tienda-1',
        codigoBarras: '123',
        nombre: 'Producto 1',
        categoria: 'Cat1',
        precioBase: 10,
        monedaId: 'mon-1',
        cantidad: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemsVenta: [],
      };
      const dto: UpdateProductoExternoDto = { tiendaId: 'tienda-2' };

      repository.findById.mockResolvedValue(existingProducto);
      tiendaClient.exists.mockResolvedValue(false);

      await expect(service.update('prod-ext-1', dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update('prod-ext-1', dto)).rejects.toThrow(
        'Tienda con id tienda-2 no existe',
      );
    });
  });

  describe('delete', () => {
    it('should delete producto externo', async () => {
      const producto: ProductoExterno = {
        id: 'prod-ext-1',
        tiendaId: 'tienda-1',
        codigoBarras: '123',
        nombre: 'Producto 1',
        categoria: 'Cat1',
        precioBase: 10,
        monedaId: 'mon-1',
        cantidad: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        itemsVenta: [],
      };

      repository.findById.mockResolvedValue(producto);
      repository.delete.mockResolvedValue(true);

      await service.delete('prod-ext-1');

      expect(repository.findById).toHaveBeenCalledWith('prod-ext-1');
      expect(repository.delete).toHaveBeenCalledWith('prod-ext-1');
    });

    it('should throw NotFoundException when producto not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('exists', () => {
    it('should return true when producto exists', async () => {
      const producto: ProductoExterno = {
        id: 'prod-ext-1',
      } as ProductoExterno;

      repository.findById.mockResolvedValue(producto);

      const result = await service.exists('prod-ext-1');

      expect(result).toBe(true);
    });

    it('should return false when producto does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.exists('non-existent');

      expect(result).toBe(false);
    });
  });
});
