import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { QueryVentaDto, VentaRepository } from './venta.repository';

describe('VentaRepository', () => {
  let repository: VentaRepository;
  let typeormRepo: jest.Mocked<Repository<Venta>>;

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
        VentaRepository,
        {
          provide: 'VENTA_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<VentaRepository>(VentaRepository);
    typeormRepo = module.get('VENTA_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save venta with items', async () => {
      const ventaData = {
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100.0,
        monedaId: 'moneda-1',
        items: [
          {
            productoExternoId: 'prod-1',
            cantidad: 2,
            precioUnitario: 50.0,
            monedaId: 'moneda-1',
          },
        ],
      };
      const createdVenta = { id: 'venta-1', ...ventaData };
      const savedVenta = {
        ...createdVenta,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(createdVenta as any);
      typeormRepo.save.mockResolvedValue(savedVenta as any);

      const result = await repository.create(ventaData as any);

      expect(typeormRepo.create).toHaveBeenCalledWith(ventaData);
      expect(typeormRepo.save).toHaveBeenCalledWith(createdVenta);
      expect(result).toEqual(savedVenta);
    });
  });

  describe('findAll', () => {
    it('should build query with left join and return ventas', async () => {
      const query: QueryVentaDto = { tiendaId: 'tienda-1' };
      const ventas: Venta[] = [];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ventas),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('venta');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'venta.items',
        'items',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'venta.tiendaId = :tiendaId',
        { tiendaId: 'tienda-1' },
      );
      expect(result).toEqual(ventas);
    });

    it('should filter by fecha range', async () => {
      const fechaDesde = new Date('2026-01-01');
      const fechaHasta = new Date('2026-12-31');
      const query: QueryVentaDto = { fechaDesde, fechaHasta };
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      await repository.findAll(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'venta.fechaHora >= :fechaDesde',
        { fechaDesde },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'venta.fechaHora <= :fechaHasta',
        { fechaHasta },
      );
    });

    it('should filter by productoExternoId', async () => {
      const query: QueryVentaDto = { productoExternoId: 'prod-ext-1' };
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      await repository.findAll(query);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'items.productoExternoId = :productoExternoId',
        { productoExternoId: 'prod-ext-1' },
      );
    });
  });

  describe('findById', () => {
    it('should find venta by id with items', async () => {
      const venta = {
        id: 'venta-1',
        items: [],
        tiendaId: 'tienda-1',
        fechaHora: new Date(),
        total: 100.0,
        monedaId: 'moneda-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Venta;
      typeormRepo.findOne.mockResolvedValue(venta);

      const result = await repository.findById('venta-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'venta-1' },
        relations: ['items'],
      });
      expect(result).toEqual(venta);
    });

    it('should return null when venta not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update venta and return updated entity with cascade', async () => {
      const existingVenta = {
        id: 'venta-1',
        tiendaId: 'tienda-1',
        items: [],
        fechaHora: new Date(),
        total: 100.0,
        monedaId: 'moneda-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Venta;
      const updates = { total: 150.0 };
      const updatedVenta = { ...existingVenta, ...updates };

      typeormRepo.findOne.mockResolvedValue(existingVenta);
      typeormRepo.save.mockResolvedValue(updatedVenta);

      const result = await repository.update('venta-1', updates);

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'venta-1' },
        relations: ['items'],
      });
      expect(typeormRepo.save).toHaveBeenCalled();
      expect(result).toEqual(updatedVenta);
    });

    it('should return null when venta not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.update('non-existent', {});

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete venta and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('venta-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('venta-1');
      expect(result).toBe(true);
    });

    it('should return false when venta not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
