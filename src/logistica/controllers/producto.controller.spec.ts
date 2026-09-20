import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProductoDto,
  QueryProductoDto,
  UpdateProductoDto,
} from '../dtos';
import { ProductoService } from '../services';
import { ProductoController } from './producto.controller';

describe('ProductoController', () => {
  let controller: ProductoController;
  let service: jest.Mocked<ProductoService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        {
          provide: ProductoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
    service = module.get(ProductoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateProductoDto = {
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-1',
      };
      const response = {
        id: 'prod-1',
        ...dto,
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
      const query: QueryProductoDto = {};
      const response = [
        {
          id: 'prod-1',
          codigoInterno: 'PROD-001',
          codigoBarras: '123456789',
          nombre: 'Producto Test',
          marca: 'Marca Test',
          categoria: 'Test',
          presentacion: '1L',
          precioBase: 100,
          monedaId: 'usd-1',
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
      const response = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(response);

      const result = await controller.findById('prod-1');

      expect(service.findById).toHaveBeenCalledWith('prod-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateProductoDto = { nombre: 'Updated' };
      const response = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Updated',
        marca: 'Marca Test',
        categoria: 'Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(response);

      const result = await controller.update('prod-1', dto);

      expect(service.update).toHaveBeenCalledWith('prod-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('prod-1');

      expect(service.delete).toHaveBeenCalledWith('prod-1');
    });
  });
});
