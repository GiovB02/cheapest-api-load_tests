import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryDespachoDto } from '../dtos';
import { DespachoRepository } from './despacho.repository';
import { Despacho } from './entities';

describe('DespachoRepository', () => {
  let repository: DespachoRepository;
  let typeormRepo: jest.Mocked<Repository<Despacho>>;

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
        DespachoRepository,
        {
          provide: 'DESPACHO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<DespachoRepository>(DespachoRepository);
    typeormRepo = module.get('DESPACHO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save despacho', async () => {
      const despachoData = {
        pedidoId: 'pedido-1',
        bodega: 'Bodega Central',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
      };
      const createdDespacho = { id: 'despacho-1', ...despachoData };
      const savedDespacho = {
        ...createdDespacho,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(createdDespacho as any);
      typeormRepo.save.mockResolvedValue(savedDespacho as any);

      const result = await repository.create(despachoData);

      expect(typeormRepo.create).toHaveBeenCalledWith(despachoData);
      expect(typeormRepo.save).toHaveBeenCalledWith(createdDespacho);
      expect(result).toEqual(savedDespacho);
    });
  });

  describe('findAll', () => {
    it('should build query and return despachos', async () => {
      const query: QueryDespachoDto = { pedidoId: 'pedido-1' };
      const despachos: Despacho[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(despachos),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('despacho');
      expect(result).toEqual(despachos);
    });
  });

  describe('findById', () => {
    it('should return despacho when found', async () => {
      const despacho = {
        id: 'despacho-1',
        pedidoId: 'pedido-1',
        bodega: 'Bodega Central',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(despacho as any);

      const result = await repository.findById('despacho-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'despacho-1' },
      });
      expect(result).toEqual(despacho);
    });

    it('should return null when despacho not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated despacho', async () => {
      const updates = { bodega: 'Bodega Sur' };
      const updatedDespacho = {
        id: 'despacho-1',
        pedidoId: 'pedido-1',
        bodega: 'Bodega Sur',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updatedDespacho as any);

      const result = await repository.update('despacho-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('despacho-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'despacho-1' },
      });
      expect(result).toEqual(updatedDespacho);
    });
  });

  describe('delete', () => {
    it('should delete despacho and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('despacho-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('despacho-1');
      expect(result).toBe(true);
    });

    it('should return false when despacho not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
