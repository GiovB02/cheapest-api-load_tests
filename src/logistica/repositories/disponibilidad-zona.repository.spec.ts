import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryDisponibilidadZonaDto } from '../dtos';
import { DisponibilidadZonaRepository } from './disponibilidad-zona.repository';
import { DisponibilidadZona } from './entities';

describe('DisponibilidadZonaRepository', () => {
  let repository: DisponibilidadZonaRepository;
  let typeormRepo: jest.Mocked<Repository<DisponibilidadZona>>;

  beforeEach(async () => {
    const mockTypeormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisponibilidadZonaRepository,
        {
          provide: 'DISPONIBILIDAD_ZONA_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<DisponibilidadZonaRepository>(
      DisponibilidadZonaRepository,
    );
    typeormRepo = module.get('DISPONIBILIDAD_ZONA_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save disponibilidad zona', async () => {
      const data = {
        catalogoId: 'catalogo-1',
        productoId: 'producto-1',
        cantidadDisponible: 100,
      };
      const now = new Date();
      const created = { id: 'dz-1', ...data, ultimaActualizacion: now };
      const saved = {
        ...created,
        createdAt: now,
        updatedAt: now,
      };

      typeormRepo.create.mockReturnValue(created as any);
      typeormRepo.save.mockResolvedValue(saved as any);

      const result = await repository.create(data);

      expect(typeormRepo.create).toHaveBeenCalledWith({
        ...data,
        ultimaActualizacion: expect.any(Date),
      });
      expect(typeormRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(saved);
    });
  });

  describe('findAll', () => {
    it('should build query and return disponibilidades', async () => {
      const query: QueryDisponibilidadZonaDto = { catalogoId: 'catalogo-1' };
      const items: DisponibilidadZona[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith(
        'disponibilidadZona',
      );
      expect(result).toEqual(items);
    });
  });

  describe('findById', () => {
    it('should return disponibilidad when found', async () => {
      const item = {
        id: 'dz-1',
        catalogoId: 'catalogo-1',
        productoId: 'producto-1',
        cantidad: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(item as any);

      const result = await repository.findById('dz-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'dz-1' },
      });
      expect(result).toEqual(item);
    });

    it('should return null when not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated item', async () => {
      const updates = { cantidadDisponible: 150 };
      const now = new Date();
      const updated = {
        id: 'dz-1',
        catalogoId: 'catalogo-1',
        productoId: 'producto-1',
        cantidadDisponible: 150,
        ultimaActualizacion: now,
        createdAt: now,
        updatedAt: now,
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updated as any);

      const result = await repository.update('dz-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('dz-1', {
        ...updates,
        ultimaActualizacion: expect.any(Date),
      });
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'dz-1' },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('dz-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('dz-1');
      expect(result).toBe(true);
    });

    it('should return false when not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
