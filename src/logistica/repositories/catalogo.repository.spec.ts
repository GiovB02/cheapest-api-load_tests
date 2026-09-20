import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryCatalogoDto } from '../dtos';
import { CatalogoRepository } from './catalogo.repository';
import { Catalogo } from './entities';

describe('CatalogoRepository', () => {
  let repository: CatalogoRepository;
  let typeormRepo: jest.Mocked<Repository<Catalogo>>;

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
        CatalogoRepository,
        {
          provide: 'CATALOGO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<CatalogoRepository>(CatalogoRepository);
    typeormRepo = module.get('CATALOGO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save catalogo', async () => {
      const catalogoData = {
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona A',
      };
      const createdCatalogo = { id: 'catalogo-1', ...catalogoData };
      const savedCatalogo = {
        ...createdCatalogo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(createdCatalogo as any);
      typeormRepo.save.mockResolvedValue(savedCatalogo as any);

      const result = await repository.create(catalogoData);

      expect(typeormRepo.create).toHaveBeenCalledWith(catalogoData);
      expect(typeormRepo.save).toHaveBeenCalledWith(createdCatalogo);
      expect(result).toEqual(savedCatalogo);
    });
  });

  describe('findAll', () => {
    it('should build query and return catalogos', async () => {
      const query: QueryCatalogoDto = { tiendaId: 'tienda-1' };
      const catalogos: Catalogo[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(catalogos),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('catalogo');
      expect(result).toEqual(catalogos);
    });
  });

  describe('findById', () => {
    it('should return catalogo when found', async () => {
      const catalogo = {
        id: 'catalogo-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona A',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(catalogo as any);

      const result = await repository.findById('catalogo-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'catalogo-1' },
      });
      expect(result).toEqual(catalogo);
    });

    it('should return null when catalogo not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated catalogo', async () => {
      const updates = { zona: 'Zona B' };
      const updatedCatalogo = {
        id: 'catalogo-1',
        tiendaId: 'tienda-1',
        vigenciaDesde: new Date('2024-01-01'),
        vigenciaHasta: new Date('2024-12-31'),
        zona: 'Zona B',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updatedCatalogo as any);

      const result = await repository.update('catalogo-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('catalogo-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'catalogo-1' },
      });
      expect(result).toEqual(updatedCatalogo);
    });
  });

  describe('delete', () => {
    it('should delete catalogo and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('catalogo-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('catalogo-1');
      expect(result).toBe(true);
    });

    it('should return false when catalogo not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
