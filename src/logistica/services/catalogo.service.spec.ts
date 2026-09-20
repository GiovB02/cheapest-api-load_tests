import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TiendaClientMock } from '../clients';
import {
  CreateCatalogoDto,
  QueryCatalogoDto,
  UpdateCatalogoDto,
} from '../dtos';
import { CatalogoRepository } from '../repositories';
import { CatalogoService } from './catalogo.service';

describe('CatalogoService', () => {
  let service: CatalogoService;
  let repository: jest.Mocked<CatalogoRepository>;
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
        CatalogoService,
        {
          provide: CatalogoRepository,
          useValue: mockRepository,
        },
        {
          provide: TiendaClientMock,
          useValue: mockTiendaClient,
        },
      ],
    }).compile();

    service = module.get<CatalogoService>(CatalogoService);
    repository = module.get(CatalogoRepository);
    tiendaClient = module.get(TiendaClientMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create catalogo when tienda exists', async () => {
      const dto: CreateCatalogoDto = {
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona A',
      };
      const entity = {
        id: 'catalogo-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      tiendaClient.exists.mockResolvedValue(true);
      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(tiendaClient.exists).toHaveBeenCalledWith(dto.tiendaId);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('catalogo-1');
    });

    it('should throw BadRequestException if tienda does not exist', async () => {
      const dto: CreateCatalogoDto = {
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona A',
      };

      tiendaClient.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return mapped catalogos', async () => {
      const query: QueryCatalogoDto = { tiendaId: 'tienda-1' };
      const entities = [
        {
          id: 'catalogo-1',
          tiendaId: 'tienda-1',
          vigenciaDesde: new Date('2024-01-01'),
          vigenciaHasta: new Date('2024-12-31'),
          zona: 'Zona A',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      repository.findAll.mockResolvedValue(entities as any);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('catalogo-1');
    });
  });

  describe('findById', () => {
    it('should return catalogo when found', async () => {
      const entity = {
        id: 'catalogo-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona A',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      const result = await service.findById('catalogo-1');

      expect(repository.findById).toHaveBeenCalledWith('catalogo-1');
      expect(result.id).toBe('catalogo-1');
    });

    it('should throw NotFoundException when catalogo not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return catalogo', async () => {
      const dto: UpdateCatalogoDto = { zona: 'Zona B' };
      const entity = {
        id: 'catalogo-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona B',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue(entity as any);

      const result = await service.update('catalogo-1', dto);

      expect(repository.update).toHaveBeenCalledWith('catalogo-1', dto);
      expect(result.zona).toBe('Zona B');
    });

    it('should throw NotFoundException when catalogo not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete catalogo', async () => {
      const entity = {
        id: 'catalogo-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona A',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);
      repository.delete.mockResolvedValue(true);

      await service.delete('catalogo-1');

      expect(repository.delete).toHaveBeenCalledWith('catalogo-1');
    });

    it('should throw NotFoundException when catalogo not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
