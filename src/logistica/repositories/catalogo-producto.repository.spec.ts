import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CatalogoProductoRepository } from './catalogo-producto.repository';
import { Catalogo } from './entities';

describe('CatalogoProductoRepository', () => {
  let repository: CatalogoProductoRepository;
  let catalogoTypeormRepo: jest.Mocked<Repository<Catalogo>> & {
    manager: { createQueryBuilder: jest.Mock };
  };

  let mockRelationQB: {
    of: jest.Mock;
    add: jest.Mock;
    remove: jest.Mock;
  };

  let mockSelectQB: {
    innerJoin: jest.Mock;
    where: jest.Mock;
    andWhere: jest.Mock;
    getCount: jest.Mock;
  };

  beforeEach(async () => {
    mockRelationQB = {
      of: jest.fn().mockReturnThis(),
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    mockSelectQB = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn(),
    };

    const mockCatalogoRepo = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockSelectQB),
      manager: {
        createQueryBuilder: jest.fn().mockReturnValue({
          relation: jest.fn().mockReturnValue(mockRelationQB),
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogoProductoRepository,
        {
          provide: 'CATALOGO_REPOSITORY',
          useValue: mockCatalogoRepo,
        },
      ],
    }).compile();

    repository = module.get<CatalogoProductoRepository>(
      CatalogoProductoRepository,
    );
    catalogoTypeormRepo = module.get('CATALOGO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('addProductoToCatalogo', () => {
    it('should use the relation query builder to add a producto to a catalogo', async () => {
      const catalogoId = 'catalogo-1';
      const productoId = 'producto-1';

      await repository.addProductoToCatalogo(catalogoId, productoId);

      expect(catalogoTypeormRepo.manager.createQueryBuilder).toHaveBeenCalled();
      expect(mockRelationQB.of).toHaveBeenCalledWith(catalogoId);
      expect(mockRelationQB.add).toHaveBeenCalledWith(productoId);
    });
  });

  describe('findByCatalogoId', () => {
    it('should return productos for a given catalogoId', async () => {
      const catalogoId = 'catalogo-1';
      const productos = [
        { id: 'producto-1', nombre: 'Producto 1' },
        { id: 'producto-2', nombre: 'Producto 2' },
      ];

      (catalogoTypeormRepo.findOne as jest.Mock).mockResolvedValue({
        id: catalogoId,
        productos,
      });

      const result = await repository.findByCatalogoId(catalogoId);

      expect(catalogoTypeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: catalogoId },
        relations: ['productos'],
      });
      expect(result).toEqual(productos);
    });

    it('should return an empty array when catalogo is not found', async () => {
      (catalogoTypeormRepo.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByCatalogoId('non-existent');

      expect(result).toEqual([]);
    });
  });

  describe('exists', () => {
    it('should return true when the relation exists', async () => {
      const catalogoId = 'catalogo-1';
      const productoId = 'producto-1';

      mockSelectQB.getCount.mockResolvedValue(1);

      const result = await repository.exists(catalogoId, productoId);

      expect(catalogoTypeormRepo.createQueryBuilder).toHaveBeenCalledWith(
        'catalogo',
      );
      expect(mockSelectQB.innerJoin).toHaveBeenCalledWith(
        'catalogo.productos',
        'producto',
      );
      expect(mockSelectQB.where).toHaveBeenCalledWith(
        'catalogo.id = :catalogoId',
        { catalogoId },
      );
      expect(mockSelectQB.andWhere).toHaveBeenCalledWith(
        'producto.id = :productoId',
        { productoId },
      );
      expect(result).toBe(true);
    });

    it('should return false when the relation does not exist', async () => {
      mockSelectQB.getCount.mockResolvedValue(0);

      const result = await repository.exists('catalogo-1', 'producto-x');

      expect(result).toBe(false);
    });
  });

  describe('removeProductoFromCatalogo', () => {
    it('should use the relation query builder to remove a producto from a catalogo', async () => {
      const catalogoId = 'catalogo-1';
      const productoId = 'producto-1';

      await repository.removeProductoFromCatalogo(catalogoId, productoId);

      expect(catalogoTypeormRepo.manager.createQueryBuilder).toHaveBeenCalled();
      expect(mockRelationQB.of).toHaveBeenCalledWith(catalogoId);
      expect(mockRelationQB.remove).toHaveBeenCalledWith(productoId);
    });
  });
});
