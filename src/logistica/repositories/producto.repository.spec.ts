import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryProductoDto } from '../dtos';
import { Producto } from './entities';
import { ProductoRepository } from './producto.repository';

describe('ProductoRepository', () => {
  let repository: ProductoRepository;
  let typeormRepo: jest.Mocked<Repository<Producto>>;

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
        ProductoRepository,
        {
          provide: 'PRODUCTO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<ProductoRepository>(ProductoRepository);
    typeormRepo = module.get('PRODUCTO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save producto', async () => {
      const productoData = {
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
      };
      const createdProducto = { id: 'prod-1', ...productoData };
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
      const query: QueryProductoDto = { categoria: 'Test' };
      const productos: Producto[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(productos),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('producto');
      expect(result).toEqual(productos);
    });
  });

  describe('findById', () => {
    it('should return producto when found', async () => {
      const producto = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Producto Test',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(producto as any);

      const result = await repository.findById('prod-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
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
    it('should update and return updated producto', async () => {
      const updates = { nombre: 'Updated Name' };
      const updatedProducto = {
        id: 'prod-1',
        codigoInterno: 'PROD-001',
        codigoBarras: '123456789',
        nombre: 'Updated Name',
        marca: 'Marca Test',
        categoria: 'Categoria Test',
        presentacion: '1L',
        precioBase: 100,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updatedProducto as any);

      const result = await repository.update('prod-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('prod-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
      });
      expect(result).toEqual(updatedProducto);
    });
  });

  describe('delete', () => {
    it('should delete producto and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('prod-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('prod-1');
      expect(result).toBe(true);
    });

    it('should return false when producto not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('findProductosDisponiblesParaTendero', () => {
    it('should query active promotions through promocion_tiendas', async () => {
      const productos: Producto[] = [];
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(productos),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findProductosDisponiblesParaTendero(
        'tienda-1',
        'zona-centro',
      );

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('producto');
      expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('JOIN promocion_tiendas pt'),
        expect.objectContaining({
          now: expect.any(Date),
          tiendaId: 'tienda-1',
        }),
      );
      expect(result).toEqual(productos);
    });
  });
});
