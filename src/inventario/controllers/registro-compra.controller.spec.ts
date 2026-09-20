import { Test, TestingModule } from '@nestjs/testing';
import { CreateRegistroCompraDto } from '../dtos/registro-compra/create-registro-compra.dto';
import { QueryRegistroCompraDto } from '../dtos/registro-compra/query-registro-compra.dto';
import { RegistroCompraResponseDto } from '../dtos/registro-compra/registro-compra-response.dto';
import { UpdateRegistroCompraDto } from '../dtos/registro-compra/update-registro-compra.dto';
import { RegistroCompraService } from '../services/registro-compra.service';
import { RegistroCompraController } from './registro-compra.controller';

describe('RegistroCompraController', () => {
  let controller: RegistroCompraController;
  let service: jest.Mocked<RegistroCompraService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroCompraController],
      providers: [
        {
          provide: RegistroCompraService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RegistroCompraController>(RegistroCompraController);
    service = module.get(RegistroCompraService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateRegistroCompraDto = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
      };
      const response: RegistroCompraResponseDto = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
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
      const query: QueryRegistroCompraDto = { tiendaId: 'tienda-1' };
      const response: RegistroCompraResponseDto[] = [];
      service.findAll.mockResolvedValue(response);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      const id = 'reg-1';
      const response: RegistroCompraResponseDto = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
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
      const dto: UpdateRegistroCompraDto = { cantidad: 20 };
      const response: RegistroCompraResponseDto = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 20,
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
