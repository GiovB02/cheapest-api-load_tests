import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProductoExternoDto,
  ProductoExternoResponseDto,
  QueryProductoExternoDto,
  UpdateProductoExternoDto,
} from '../dtos';
import { ProductoExternoService } from '../services';
import { ProductoExternoController } from './producto-externo.controller';

describe('ProductoExternoController', () => {
  let controller: ProductoExternoController;
  let service: jest.Mocked<ProductoExternoService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoExternoController],
      providers: [
        {
          provide: ProductoExternoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductoExternoController>(
      ProductoExternoController,
    );
    service = module.get(ProductoExternoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateProductoExternoDto = {
        tiendaId: 'tienda-1',
        codigoBarras: '1234567890',
        nombre: 'Producto Test',
        categoria: 'Bebidas',
        precioBase: 10.5,
        monedaId: 'moneda-1',
        cantidad: 100,
      };
      const response: ProductoExternoResponseDto = {
        id: 'prod-ext-1',
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
      const query: QueryProductoExternoDto = { tiendaId: 'tienda-1' };
      const response: ProductoExternoResponseDto[] = [
        {
          id: 'prod-ext-1',
          tiendaId: 'tienda-1',
          codigoBarras: '123',
          nombre: 'Producto 1',
          categoria: 'Cat1',
          precioBase: 10.5,
          monedaId: 'mon-1',
          cantidad: 50,
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
      const response: ProductoExternoResponseDto = {
        id: 'prod-ext-1',
        tiendaId: 'tienda-1',
        codigoBarras: '123',
        nombre: 'Producto 1',
        categoria: 'Cat1',
        precioBase: 10.5,
        monedaId: 'mon-1',
        cantidad: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.findById.mockResolvedValue(response);

      const result = await controller.findById('prod-ext-1');

      expect(service.findById).toHaveBeenCalledWith('prod-ext-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateProductoExternoDto = { precioBase: 15.0 };
      const response: ProductoExternoResponseDto = {
        id: 'prod-ext-1',
        tiendaId: 'tienda-1',
        codigoBarras: '123',
        nombre: 'Producto 1',
        categoria: 'Cat1',
        precioBase: 15.0,
        monedaId: 'mon-1',
        cantidad: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.update.mockResolvedValue(response);

      const result = await controller.update('prod-ext-1', dto);

      expect(service.update).toHaveBeenCalledWith('prod-ext-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('prod-ext-1');

      expect(service.delete).toHaveBeenCalledWith('prod-ext-1');
    });
  });
});
