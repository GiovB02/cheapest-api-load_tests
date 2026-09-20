import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryNotaCreditoDto } from '../dtos';
import { NotaCredito } from './entities';
import { NotaCreditoRepository } from './nota-credito.repository';

describe('NotaCreditoRepository', () => {
  let repository: NotaCreditoRepository;
  let typeormRepo: jest.Mocked<Repository<NotaCredito>>;

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
        NotaCreditoRepository,
        {
          provide: 'NOTA_CREDITO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<NotaCreditoRepository>(NotaCreditoRepository);
    typeormRepo = module.get('NOTA_CREDITO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save nota credito', async () => {
      const data = {
        pedidoId: 'pedido-1',
        monto: 100.5,
        razon: 'Devolucion parcial',
        monedaId: 'usd-id',
      };
      const created = { id: 'nc-1', ...data };
      const saved = {
        ...created,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(created as any);
      typeormRepo.save.mockResolvedValue(saved as any);

      const result = await repository.create(data);

      expect(typeormRepo.create).toHaveBeenCalledWith(data);
      expect(typeormRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(saved);
    });
  });

  describe('findAll', () => {
    it('should build query and return notas credito', async () => {
      const query: QueryNotaCreditoDto = { pedidoId: 'pedido-1' };
      const items: NotaCredito[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith(
        'notaCredito',
      );
      expect(result).toEqual(items);
    });
  });

  describe('findById', () => {
    it('should return nota credito when found', async () => {
      const item = {
        id: 'nc-1',
        pedidoId: 'pedido-1',
        monto: 100.5,
        razon: 'Devolucion parcial',
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(item as any);

      const result = await repository.findById('nc-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'nc-1' },
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
      const updates = { monto: 150.75 };
      const updated = {
        id: 'nc-1',
        pedidoId: 'pedido-1',
        monto: 150.75,
        razon: 'Devolucion parcial',
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updated as any);

      const result = await repository.update('nc-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('nc-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'nc-1' },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('nc-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('nc-1');
      expect(result).toBe(true);
    });

    it('should return false when not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
