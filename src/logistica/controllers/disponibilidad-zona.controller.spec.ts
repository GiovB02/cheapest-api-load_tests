import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateDisponibilidadZonaDto,
  QueryDisponibilidadZonaDto,
  UpdateDisponibilidadZonaDto,
} from '../dtos';
import {
  Catalogo,
  DisponibilidadZona,
  Producto,
} from '../repositories/entities';
import { DisponibilidadZonaService } from '../services';
import { DisponibilidadZonaController } from './disponibilidad-zona.controller';

describe('DisponibilidadZonaController', () => {
  let controller: DisponibilidadZonaController;
  let service: jest.Mocked<DisponibilidadZonaService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibilidadZonaController],
      providers: [
        {
          provide: DisponibilidadZonaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DisponibilidadZonaController>(
      DisponibilidadZonaController,
    );
    service = module.get(DisponibilidadZonaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateDisponibilidadZonaDto = {
        catalogoId: 'cat-1',
        productoId: 'prod-1',
        cantidadDisponible: 100,
      };
      const response = {
        id: 'dz-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        ultimaActualizacion: new Date(),
      };

      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const query: QueryDisponibilidadZonaDto = {};
      const response: DisponibilidadZona[] = [
        {
          id: 'dz-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          ultimaActualizacion: new Date(),
          cantidadDisponible: 100,
          catalogoId: 'cat-1',
          catalogo: new Catalogo(),
          productoId: 'prod-1',
          producto: new Producto(),
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
        id: 'dz-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ultimaActualizacion: new Date(),
        cantidadDisponible: 100,
        catalogoId: 'cat-1',
        catalogo: new Catalogo(),
        productoId: 'prod-1',
        producto: new Producto(),
      };

      service.findById.mockResolvedValue(response);

      const result = await controller.findById('dz-1');

      expect(service.findById).toHaveBeenCalledWith('dz-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateDisponibilidadZonaDto = {};
      const response = {
        id: 'dz-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ultimaActualizacion: new Date(),
        cantidadDisponible: 100,
        catalogoId: 'cat-1',
        catalogo: new Catalogo(),
        productoId: 'prod-1',
        producto: new Producto(),
      };

      service.update.mockResolvedValue(response);

      const result = await controller.update('dz-1', dto);

      expect(service.update).toHaveBeenCalledWith('dz-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('dz-1');

      expect(service.delete).toHaveBeenCalledWith('dz-1');
    });
  });
});
