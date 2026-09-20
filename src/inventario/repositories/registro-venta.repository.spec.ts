import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryRegistroVentaDto } from '../dtos/registro-venta/query-registro-venta.dto';
import { RegistroVentaProductoTienda } from './entities/registro-venta-producto-tienda.entity';
import { RegistroVentaRepository } from './registro-venta.repository';

describe('RegistroVentaRepository', () => {
  let repository: RegistroVentaRepository;
  let typeormRepo: jest.Mocked<Repository<RegistroVentaProductoTienda>>;

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
        RegistroVentaRepository,
        {
          provide: 'REGISTRO_VENTA_PRODUCTO_TIENDA_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<RegistroVentaRepository>(RegistroVentaRepository);
    typeormRepo = module.get('REGISTRO_VENTA_PRODUCTO_TIENDA_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save registro', async () => {
      const registroData = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
      };
      const createdRegistro = { id: 'reg-1', ...registroData };
      const savedRegistro = {
        ...createdRegistro,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(createdRegistro as any);
      typeormRepo.save.mockResolvedValue(savedRegistro as any);

      const result = await repository.create(registroData);

      expect(typeormRepo.create).toHaveBeenCalledWith(registroData);
      expect(typeormRepo.save).toHaveBeenCalledWith(createdRegistro);
      expect(result).toEqual(savedRegistro);
    });
  });

  describe('findAll', () => {
    it('should build query and return registros', async () => {
      const query: QueryRegistroVentaDto = {
        tiendaId: 'tienda-1',
        fechaDesde: '2023-01-01',
      };
      const registros: RegistroVentaProductoTienda[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(registros),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('registro');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'registro.tiendaId = :tiendaId',
        { tiendaId: 'tienda-1' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'registro.fechaVenta >= :fechaDesde',
        { fechaDesde: expect.any(Date) },
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(registros);
    });
  });

  describe('findById', () => {
    it('should find registro by id', async () => {
      const registro: RegistroVentaProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(registro);

      const result = await repository.findById('reg-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'reg-1' },
      });
      expect(result).toEqual(registro);
    });
  });

  describe('update', () => {
    it('should update and return registro', async () => {
      const updates = { cantidad: 10 };
      const registro: RegistroVentaProductoTienda = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        ventaId: 'venta-1',
        itemInventarioId: 'item-1',
        fechaVenta: new Date(),
        cantidad: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne = jest.fn().mockResolvedValue(registro);

      const result = await repository.update('reg-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('reg-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'reg-1' },
      });
      expect(result).toEqual(registro);
    });
  });

  describe('delete', () => {
    it('should delete and return true if affected', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('reg-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('reg-1');
      expect(result).toBe(true);
    });

    it('should return false if not affected', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('reg-1');

      expect(result).toBe(false);
    });
  });
});
