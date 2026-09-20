import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateCatalogoDto,
  QueryCatalogoDto,
  UpdateCatalogoDto,
} from '../dtos';
import { CatalogoService } from '../services';
import { CatalogoController } from './catalogo.controller';

describe('CatalogoController', () => {
  let controller: CatalogoController;
  let service: jest.Mocked<CatalogoService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogoController],
      providers: [
        {
          provide: CatalogoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CatalogoController>(CatalogoController);
    service = module.get(CatalogoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateCatalogoDto = {
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'ZONA_NORTE',
      };
      const response = {
        id: 'cat-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'ZONA_NORTE',
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
      const query: QueryCatalogoDto = { tiendaId: 'tienda-1' };
      const response = [
        {
          id: 'cat-1',
          tiendaId: 'tienda-1',
          vigenciaDesde: new Date(),
          vigenciaHasta: new Date(),
          zona: 'ZONA_NORTE',
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
        id: 'cat-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date(),
        vigenciaHasta: new Date(),
        zona: 'ZONA_NORTE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(response);

      const result = await controller.findById('cat-1');

      expect(service.findById).toHaveBeenCalledWith('cat-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateCatalogoDto = { zona: 'ZONA_SUR' };
      const response = {
        id: 'cat-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date(),
        vigenciaHasta: new Date(),
        zona: 'ZONA_SUR',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(response);

      const result = await controller.update('cat-1', dto);

      expect(service.update).toHaveBeenCalledWith('cat-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('cat-1');

      expect(service.delete).toHaveBeenCalledWith('cat-1');
    });
  });
});
