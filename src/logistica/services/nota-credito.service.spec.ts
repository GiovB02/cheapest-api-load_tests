import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateNotaCreditoDto,
  QueryNotaCreditoDto,
  UpdateNotaCreditoDto,
} from '../dtos';
import { NotaCreditoRepository, PedidoRepository } from '../repositories';
import { MotivoNotaCredito } from '../repositories/entities';
import { NotaCreditoService } from './nota-credito.service';

describe('NotaCreditoService', () => {
  let service: NotaCreditoService;
  let repository: jest.Mocked<NotaCreditoRepository>;
  let pedidoRepository: jest.Mocked<PedidoRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockPedidoRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotaCreditoService,
        {
          provide: NotaCreditoRepository,
          useValue: mockRepository,
        },
        {
          provide: PedidoRepository,
          useValue: mockPedidoRepository,
        },
      ],
    }).compile();

    service = module.get<NotaCreditoService>(NotaCreditoService);
    repository = module.get(NotaCreditoRepository);
    pedidoRepository = module.get(PedidoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create nota credito when pedido exists', async () => {
      const dto: CreateNotaCreditoDto = {
        pedidoId: 'pedido-1',
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
        monto: 100,
        monedaId: 'usd-1',
        numeroDocumento: 'NC-001',
        fecha: new Date(),
      };
      const pedido = { id: 'pedido-1' };
      const entity = {
        id: 'nc-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      pedidoRepository.findById.mockResolvedValue(pedido as any);
      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(pedidoRepository.findById).toHaveBeenCalledWith('pedido-1');
      expect(result).toEqual(
        expect.objectContaining({
          id: 'nc-1',
          pedidoId: 'pedido-1',
        }),
      );
    });

    it('should throw BadRequestException when pedido does not exist', async () => {
      const dto: CreateNotaCreditoDto = {
        pedidoId: 'non-existent',
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
        monto: 100,
        monedaId: 'usd-1',
        numeroDocumento: 'NC-002',
        fecha: new Date(),
      };

      pedidoRepository.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return mapped notas credito', async () => {
      const query: QueryNotaCreditoDto = {};
      const entities = [
        {
          id: 'nc-1',
          pedidoId: 'pedido-1',
          motivo: 'Producto defectuoso',
          montoAjuste: 100,
          monedaId: 'usd-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      repository.findAll.mockResolvedValue(entities as any);

      const result = await service.findAll(query);

      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return nota credito when found', async () => {
      const entity = {
        id: 'nc-1',
        pedidoId: 'pedido-1',
        motivo: 'Producto defectuoso',
        montoAjuste: 100,
        monedaId: 'usd-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      const result = await service.findById('nc-1');

      expect(result.id).toBe('nc-1');
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update nota credito', async () => {
      const dto: UpdateNotaCreditoDto = {
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
      };
      const entity = {
        id: 'nc-1',
        pedidoId: 'pedido-1',
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
        monto: 100,
        monedaId: 'usd-1',
        numeroDocumento: 'NC-001',
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = {
        ...entity,
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
      };

      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue(updated as any);

      const result = await service.update('nc-1', dto);

      expect(result.motivo).toBe(MotivoNotaCredito.PRODUCTO_EQUIVOCADO);
    });
  });

  describe('delete', () => {
    it('should delete nota credito', async () => {
      const entity = {
        id: 'nc-1',
        pedidoId: 'pedido-1',
        motivo: MotivoNotaCredito.PRODUCTO_EQUIVOCADO,
        monto: 100,
        monedaId: 'usd-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      await service.delete('nc-1');

      expect(repository.delete).toHaveBeenCalledWith('nc-1');
    });
  });
});
