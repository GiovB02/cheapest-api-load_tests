import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProductoDto,
  QueryProductoDto,
  UpdateProductoDto,
} from '../dtos';
import { ProductoRepository } from '../repositories';
import { ProductoService } from './producto.service';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: jest.Mocked<ProductoRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        {
          provide: ProductoRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get(ProductoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return producto', async () => {
      const dto: CreateProductoDto = {
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
      };
      const entity = {
        id: 'prod-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return mapped productos', async () => {
      const query: QueryProductoDto = { categoria: 'Test' };
      const entities = [
        {
          id: 'prod-1',
          codigoInterno: 'PROD-001',
          codigoBarras: '123456789',
          nombre: 'Producto Test',
          marca: 'Marca Test',
          categoria: 'Test',
          presentacion: '1L',
          precioBase: 100,
          monedaId: 'usd-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      repository.findAll.mockResolvedValue(entities as any);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('prod-1');
    });
  });

  describe('findById', () => {
    it('should return producto when found', async () => {
      const entity = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      const result = await service.findById('prod-1');

      expect(repository.findById).toHaveBeenCalledWith('prod-1');
      expect(result.id).toBe('prod-1');
    });

    it('should throw NotFoundException when producto not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return producto', async () => {
      const dto: UpdateProductoDto = { nombre: 'Updated' };
      const entity = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Updated',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue(entity as any);

      const result = await service.update('prod-1', dto);

      expect(repository.update).toHaveBeenCalledWith('prod-1', dto);
      expect(result.nombre).toBe('Updated');
    });

    it('should throw NotFoundException when producto not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete producto', async () => {
      const entity = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);
      repository.delete.mockResolvedValue(true);

      await service.delete('prod-1');

      expect(repository.delete).toHaveBeenCalledWith('prod-1');
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
      const entity = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      const result = await service.exists('prod-1');

      expect(result).toBe(true);
    });

    it('should return false when producto does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.exists('non-existent');

      expect(result).toBe(false);
    });
  });
});
