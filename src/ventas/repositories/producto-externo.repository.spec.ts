import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductoExterno } from './entities/producto-externo.entity';
import {
  ProductoExternoRepository,
  QueryProductoExternoDto,
} from './producto-externo.repository';

describe('ProductoExternoRepository', () => {
  let repository: ProductoExternoRepository;
  let typeormRepo: jest.Mocked<Repository<ProductoExterno>>;

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
        ProductoExternoRepository,
        {
          provide: 'PRODUCTO_EXTERNO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<ProductoExternoRepository>(
      ProductoExternoRepository,
    );
    typeormRepo = module.get('PRODUCTO_EXTERNO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save producto externo', async () => {
      const productoData = {
        tiendaId: 'tienda-1',
        codigoBarras: '1234567890',
        nombre: 'Producto Test',
        categoria: 'Bebidas',
        precioBase: 10.5,
        monedaId: 'moneda-1',
        cantidad: 100,
      };
      const createdProducto = { id: 'prod-ext-1', ...productoData };
      const savedProducto = {
        ...createdProducto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(createdProducto as any);
      typeormRepo.save.mockResolvedValue(savedProducto as any);

      const result = await repository.create(productoData);

      expect(typeormRepo.create).toHaveBeenCalledWith(productoData);
      expect(typeormRepo.save).toHaveBeenCalledWith(createdProducto);
      expect(result).toEqual(savedProducto);
    });
  });

  describe('findAll', () => {
    it('should build query and return productos', async () => {
      const query: QueryProductoExternoDto = { tiendaId: 'tienda-1' };
      const productos: ProductoExterno[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(productos),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith(
        'productoExterno',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'productoExterno.tiendaId = :tiendaId',
        { tiendaId: 'tienda-1' },
      );
      expect(result).toEqual(productos);
    });

    it('should filter by codigo barras', async () => {
      const query: QueryProductoExternoDto = { codigoBarras: '123456' };
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      await repository.findAll(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'productoExterno.codigoBarras = :codigoBarras',
        { codigoBarras: '123456' },
      );
    });

    it('should filter by categoria', async () => {
      const query: QueryProductoExternoDto = { categoria: 'Bebidas' };
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      await repository.findAll(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'productoExterno.categoria = :categoria',
        { categoria: 'Bebidas' },
      );
    });

    it('should filter by nombre with LIKE', async () => {
      const query: QueryProductoExternoDto = { nombre: 'Coca' };
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      await repository.findAll(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'productoExterno.nombre LIKE :nombre',
        { nombre: '%Coca%' },
      );
    });
  });

  describe('findById', () => {
    it('should find producto by id', async () => {
      const producto = { id: 'prod-ext-1' } as ProductoExterno;
      typeormRepo.findOne.mockResolvedValue(producto);

      const result = await repository.findById('prod-ext-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'prod-ext-1' },
      });
      expect(result).toEqual(producto);
    });

    it('should return null when producto not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update producto and return updated entity', async () => {
      const updates = { precioBase: 15.0 };
      const updatedProducto = {
        id: 'prod-ext-1',
        precioBase: 15.0,
      } as ProductoExterno;

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updatedProducto);

      const result = await repository.update('prod-ext-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('prod-ext-1', updates);
      expect(result).toEqual(updatedProducto);
    });

    it('should return null when producto not found after update', async () => {
      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.update('non-existent', {});

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete producto and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('prod-ext-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('prod-ext-1');
      expect(result).toBe(true);
    });

    it('should return false when producto not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
