import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryPedidoDto } from '../dtos';
import { EstadoPedido, Pedido } from './entities';
import { PedidoRepository } from './pedido.repository';

describe('PedidoRepository', () => {
  let repository: PedidoRepository;
  let typeormRepo: jest.Mocked<Repository<Pedido>>;

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
        PedidoRepository,
        {
          provide: 'PEDIDO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<PedidoRepository>(PedidoRepository);
    typeormRepo = module.get('PEDIDO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save pedido', async () => {
      const pedidoData = {
        tiendaId: 'tienda-1',
        estado: EstadoPedido.APROBADO,
        monedaId: 'usd-id',
      };
      const createdPedido = { id: 'pedido-1', ...pedidoData };
      const savedPedido = {
        ...createdPedido,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(createdPedido as any);
      typeormRepo.save.mockResolvedValue(savedPedido as any);

      const result = await repository.create(pedidoData);

      expect(typeormRepo.create).toHaveBeenCalledWith(pedidoData);
      expect(typeormRepo.save).toHaveBeenCalledWith(createdPedido);
      expect(result).toEqual(savedPedido);
    });
  });

  describe('findAll', () => {
    it('should build query and return pedidos with items', async () => {
      const query: QueryPedidoDto = { tiendaId: 'tienda-1' };
      const pedidos: Pedido[] = [];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(pedidos),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('pedido');
      expect(result).toEqual(pedidos);
    });
  });

  describe('findById', () => {
    it('should return pedido when found', async () => {
      const pedido = {
        id: 'pedido-1',
        tiendaId: 'tienda-1',
        estado: EstadoPedido.CREADO,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(pedido as any);

      const result = await repository.findById('pedido-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'pedido-1' },
        relations: ['items'],
      });
      expect(result).toEqual(pedido);
    });

    it('should return null when pedido not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated pedido', async () => {
      const updates = { estado: EstadoPedido.DESPACHADO };
      const updatedPedido = {
        id: 'pedido-1',
        tiendaId: 'tienda-1',
        estado: EstadoPedido.DESPACHADO,
        monedaId: 'usd-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updatedPedido as any);

      const result = await repository.update('pedido-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('pedido-1', updates);
      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'pedido-1' },
        relations: ['items'],
      });
      expect(result).toEqual(updatedPedido);
    });
  });

  describe('delete', () => {
    it('should delete pedido and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('pedido-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('pedido-1');
      expect(result).toBe(true);
    });

    it('should return false when pedido not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
