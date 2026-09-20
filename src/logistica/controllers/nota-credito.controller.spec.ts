import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateNotaCreditoDto,
  QueryNotaCreditoDto,
  UpdateNotaCreditoDto,
} from '../dtos';
import { MotivoNotaCredito } from '../repositories/entities';
import { NotaCreditoService } from '../services';
import { NotaCreditoController } from './nota-credito.controller';

describe('NotaCreditoController', () => {
  let controller: NotaCreditoController;
  let service: jest.Mocked<NotaCreditoService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotaCreditoController],
      providers: [
        {
          provide: NotaCreditoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NotaCreditoController>(NotaCreditoController);
    service = module.get(NotaCreditoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateNotaCreditoDto = {
        pedidoId: 'ped-1',
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
        monto: 100,
        monedaId: 'usd-1',
        numeroDocumento: 'NC-001',
        fecha: new Date(),
      };
      const response = {
        id: 'nc-1',
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
    it('should call service.findAll', async () => {
      const query: QueryNotaCreditoDto = {};
      const response = [
        {
          id: 'nc-1',
          pedidoId: 'ped-1',
          motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
          monto: 100,
          monedaId: 'usd-1',
          numeroDocumento: 'NC-001',
          fecha: new Date(),
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
        id: 'nc-1',
        pedidoId: 'ped-1',
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
        monto: 100,
        monedaId: 'usd-1',
        numeroDocumento: 'NC-001',
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(response);

      const result = await controller.findById('nc-1');

      expect(service.findById).toHaveBeenCalledWith('nc-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateNotaCreditoDto = {
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
      };
      const response = {
        id: 'nc-1',
        pedidoId: 'ped-1',
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
        monto: 100,
        monedaId: 'usd-1',
        numeroDocumento: 'NC-001',
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(response);

      const result = await controller.update('nc-1', dto);

      expect(service.update).toHaveBeenCalledWith('nc-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('nc-1');

      expect(service.delete).toHaveBeenCalledWith('nc-1');
    });
  });
});
