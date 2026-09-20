import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryRegistroCompraDto } from '../dtos/registro-compra/query-registro-compra.dto';
import { RegistroCompraProductoTienda } from './entities/registro-compra-producto-tienda.entity';
import { RegistroCompraRepository } from './registro-compra.repository';

describe('RegistroCompraRepository', () => {
  let repository: RegistroCompraRepository;
  let typeormRepo: jest.Mocked<Repository<RegistroCompraProductoTienda>>;

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
        RegistroCompraRepository,
        {
          provide: 'REGISTRO_COMPRA_PRODUCTO_TIENDA_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<RegistroCompraRepository>(RegistroCompraRepository);
    typeormRepo = module.get('REGISTRO_COMPRA_PRODUCTO_TIENDA_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save registro', async () => {
      const registroData = {
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
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
      const query: QueryRegistroCompraDto = {
        tiendaId: 'tienda-1',
        fechaDesde: '2023-01-01',
      };
      const registros: RegistroCompraProductoTienda[] = [];
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
        'registro.fechaCompra >= :fechaDesde',
        { fechaDesde: expect.any(Date) },
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(registros);
    });
  });

  describe('findById', () => {
    it('should find registro by id', async () => {
      const registro = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(registro as any);

      const result = await repository.findById('reg-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'reg-1' },
      });
      expect(result).toEqual(registro);
    });
  });

  describe('update', () => {
    it('should update and return registro', async () => {
      const updates = { cantidad: 20 };
      const registro = {
        id: 'reg-1',
        tiendaId: 'tienda-1',
        productoId: 'prod-1',
        compraId: 'compra-1',
        itemInventarioId: 'item-1',
        fechaCompra: new Date(),
        cantidad: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne = jest.fn().mockResolvedValue(registro as any);

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
