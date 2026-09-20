import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Promocion } from './entities';
import { PromocionRepository } from './promocion.repository';

describe('PromocionRepository', () => {
  let repository: PromocionRepository;
  let typeormRepo: jest.Mocked<Repository<Promocion>>;

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
        PromocionRepository,
        {
          provide: 'PROMOCION_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<PromocionRepository>(PromocionRepository);
    typeormRepo = module.get('PROMOCION_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save promocion', async () => {
      const data = {
        nombre: 'Promocion Test',
        precioPromocional: 100.5,
        monedaId: 'moneda-1',
        productoId: '9d32f377-3070-4fe5-b3b4-a131c77d3ba8',
        tiendaIds: [
          '8f0c0ec3-9a3f-4aeb-b4cf-7bc83a9b651f',
          '8f0c0ec3-9a3f-4aeb-b4cf-7bc83a9b651f',
          '2b2fd91d-4eff-425c-b60f-3574b5b9c6b4',
        ],
        inicio: new Date(),
        fin: new Date(),
        restricciones: 2,
      };
      const created = { id: 'prom-1', ...data };
      const saved = {
        ...created,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(created as any);
      typeormRepo.save.mockResolvedValue(saved as any);

      const result = await repository.create(data);

      expect(typeormRepo.create).toHaveBeenCalledWith({
        ...data,
        tiendas: [
          { tiendaId: '8f0c0ec3-9a3f-4aeb-b4cf-7bc83a9b651f' },
          { tiendaId: '2b2fd91d-4eff-425c-b60f-3574b5b9c6b4' },
        ],
      });
      expect(typeormRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(saved);
    });
  });

  describe('findAll', () => {
    it('should build query and return promociones', async () => {
      const query = { nombre: 'test' };
      const items: Promocion[] = [];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('promocion');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'promocion.tiendas',
        'tiendas',
      );
      expect(result).toEqual(items);
    });

    it('should not add where clause if no nombre provided', async () => {
      const query = {};
      const items: Promocion[] = [];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      await repository.findAll(query);

      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return promocion when found', async () => {
      const item = {
        id: 'prom-1',
        nombre: 'Promocion Test',
        precioPromocional: 100.5,
        monedaId: 'moneda-1',
        inicio: new Date(),
        fin: new Date(),
        restricciones: 'Some restrictions',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(item as any);

      const result = await repository.findById('prom-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'prom-1' },
        relations: ['tiendas'],
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
      const updates = { precioPromocional: 150.75 };
      const updated = {
        id: 'prom-1',
        nombre: 'Promocion Test',
        precioPromocional: 150.75,
        monedaId: 'moneda-1',
        inicio: new Date(),
        fin: new Date(),
        restricciones: 'Some restrictions',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updated as any);

      const result = await repository.update('prom-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('prom-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'prom-1' },
        relations: ['tiendas'],
      });
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('prom-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('prom-1');
      expect(result).toBe(true);
    });

    it('should return false when not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
