import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateDespachoDto,
  QueryDespachoDto,
  UpdateDespachoDto,
} from '../dtos';
import { DespachoService } from '../services';
import { DespachoController } from './despacho.controller';

describe('DespachoController', () => {
  let controller: DespachoController;
  let service: jest.Mocked<DespachoService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DespachoController],
      providers: [
        {
          provide: DespachoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DespachoController>(DespachoController);
    service = module.get(DespachoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateDespachoDto = {
        pedidoId: 'ped-1',
        bodega: 'BODEGA_A',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
      };
      const response = {
        id: 'desp-1',
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
      const query: QueryDespachoDto = {};
      const response = [
        {
          id: 'desp-1',
          pedidoId: 'ped-1',
          bodega: 'BODEGA_A',
          horaSalida: new Date(),
          ventanaPrometidaInicio: new Date(),
          ventanaPrometidaFin: new Date(),
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
        id: 'desp-1',
        pedidoId: 'ped-1',
        bodega: 'BODEGA_A',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(response);

      const result = await controller.findById('desp-1');

      expect(service.findById).toHaveBeenCalledWith('desp-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateDespachoDto = { bodega: 'BODEGA_B' };
      const response = {
        id: 'desp-1',
        pedidoId: 'ped-1',
        bodega: 'BODEGA_B',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(response);

      const result = await controller.update('desp-1', dto);

      expect(service.update).toHaveBeenCalledWith('desp-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('desp-1');

      expect(service.delete).toHaveBeenCalledWith('desp-1');
    });
  });
});
