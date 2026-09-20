import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryItemInventarioDto } from '../dtos/item-inventario/query-item-inventario.dto';
import { ItemInventario } from './entities/item-inventario.entity';
import { ItemInventarioRepository } from './item-inventario.repository';

describe('ItemInventarioRepository', () => {
  let repository: ItemInventarioRepository;
  let typeormRepo: jest.Mocked<Repository<ItemInventario>>;

  beforeEach(async () => {
    const mockTypeormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      decrement: jest.fn(),
      increment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemInventarioRepository,
        {
          provide: 'ITEM_INVENTARIO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<ItemInventarioRepository>(ItemInventarioRepository);
    typeormRepo = module.get('ITEM_INVENTARIO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save item', async () => {
      const itemData = {
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
      };
      const createdItem = { id: 'item-1', ...itemData };
      const savedItem = {
        ...createdItem,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(createdItem as any);
      typeormRepo.save.mockResolvedValue(savedItem as any);

      const result = await repository.create(itemData);

      expect(typeormRepo.create).toHaveBeenCalledWith(itemData);
      expect(typeormRepo.save).toHaveBeenCalledWith(createdItem);
      expect(result).toEqual(savedItem);
    });
  });

  describe('findAll', () => {
    it('should build query and return items', async () => {
      const query: QueryItemInventarioDto = { tiendaId: 'tienda-1' };
      const items: ItemInventario[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('item');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'item.tiendaId = :tiendaId',
        { tiendaId: 'tienda-1' },
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(items);
    });

    it('should filter by productoId if provided', async () => {
      const query: QueryItemInventarioDto = { productoId: 'prod-1' };
      const items: ItemInventario[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      await repository.findAll(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'item.productoId = :productoId',
        { productoId: 'prod-1' },
      );
    });
  });

  describe('findById', () => {
    it('should find item by id', async () => {
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      typeormRepo.findOne.mockResolvedValue(item);

      const result = await repository.findById('item-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
      expect(result).toEqual(item);
    });
  });

  describe('findByProductoAndTienda', () => {
    it('should find item by producto and tienda', async () => {
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 10,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      typeormRepo.findOne.mockResolvedValue(item);

      const result = await repository.findByProductoAndTienda(
        'prod-1',
        'tienda-1',
      );

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { productoId: 'prod-1', tiendaId: 'tienda-1' },
      });
      expect(result).toEqual(item);
    });
  });

  describe('update', () => {
    it('should update and return item', async () => {
      const updates = { cantidad: 20 };
      const item: ItemInventario = {
        id: 'item-1',
        productoId: 'prod-1',
        tiendaId: 'tienda-1',
        cantidad: 20,
        precioVenta: 100,
        monedaId: 'usd',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrosVenta: [],
        registrosCompra: [],
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne = jest.fn().mockResolvedValue(item);

      const result = await repository.update('item-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('item-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
      expect(result).toEqual(item);
    });
  });

  describe('delete', () => {
    it('should delete and return true if affected', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('item-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('item-1');
      expect(result).toBe(true);
    });

    it('should return false if not affected', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('item-1');

      expect(result).toBe(false);
    });
  });

  describe('decrementCantidad', () => {
    it('should decrement cantidad', async () => {
      typeormRepo.decrement.mockResolvedValue(undefined);

      await repository.decrementCantidad('item-1', 5);

      expect(typeormRepo.decrement).toHaveBeenCalledWith(
        { id: 'item-1' },
        'cantidad',
        5,
      );
    });
  });

  describe('incrementCantidad', () => {
    it('should increment cantidad', async () => {
      typeormRepo.increment.mockResolvedValue(undefined);

      await repository.incrementCantidad('item-1', 5);

      expect(typeormRepo.increment).toHaveBeenCalledWith(
        { id: 'item-1' },
        'cantidad',
        5,
      );
    });
  });
});
