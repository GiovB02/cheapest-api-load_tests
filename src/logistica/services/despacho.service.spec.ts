import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateDespachoDto,
  QueryDespachoDto,
  UpdateDespachoDto,
} from '../dtos';
import { DespachoRepository, PedidoRepository } from '../repositories';
import { DespachoService } from './despacho.service';

describe('DespachoService', () => {
  let service: DespachoService;
  let despachoRepository: jest.Mocked<DespachoRepository>;
  let pedidoRepository: jest.Mocked<PedidoRepository>;

  beforeEach(async () => {
    const mockDespachoRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockPedidoRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DespachoService,
        {
          provide: DespachoRepository,
          useValue: mockDespachoRepository,
        },
        {
          provide: PedidoRepository,
          useValue: mockPedidoRepository,
        },
      ],
    }).compile();

    service = module.get<DespachoService>(DespachoService);
    despachoRepository = module.get(DespachoRepository);
    pedidoRepository = module.get(PedidoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create despacho when pedido exists', async () => {
      const dto: CreateDespachoDto = {
        pedidoId: 'pedido-1',
        bodega: 'Bodega Central',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
      };
      const pedido = { id: 'pedido-1' };
      const entity = {
        id: 'despacho-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      pedidoRepository.findById.mockResolvedValue(pedido as any);
      despachoRepository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(pedidoRepository.findById).toHaveBeenCalledWith(dto.pedidoId);
      expect(despachoRepository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('despacho-1');
    });

    it('should throw BadRequestException if pedido does not exist', async () => {
      const dto: CreateDespachoDto = {
        pedidoId: 'pedido-1',
        bodega: 'Bodega Central',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
      };

      pedidoRepository.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return mapped despachos', async () => {
      const query: QueryDespachoDto = { pedidoId: 'pedido-1' };
      const entities = [
        {
          id: 'despacho-1',
          pedidoId: 'pedido-1',
          bodega: 'Bodega Central',
          horaSalida: new Date(),
          ventanaPrometidaInicio: new Date(),
          ventanaPrometidaFin: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      despachoRepository.findAll.mockResolvedValue(entities as any);

      const result = await service.findAll(query);

      expect(despachoRepository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return despacho when found', async () => {
      const entity = {
        id: 'despacho-1',
        pedidoId: 'pedido-1',
        bodega: 'Bodega Central',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      despachoRepository.findById.mockResolvedValue(entity as any);

      const result = await service.findById('despacho-1');

      expect(despachoRepository.findById).toHaveBeenCalledWith('despacho-1');
      expect(result.id).toBe('despacho-1');
    });

    it('should throw NotFoundException when despacho not found', async () => {
      despachoRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return despacho', async () => {
      const dto: UpdateDespachoDto = { bodega: 'Bodega Sur' };
      const entity = {
        id: 'despacho-1',
        pedidoId: 'pedido-1',
        bodega: 'Bodega Sur',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      despachoRepository.findById.mockResolvedValue(entity as any);
      despachoRepository.update.mockResolvedValue(entity as any);

      const result = await service.update('despacho-1', dto);

      expect(despachoRepository.update).toHaveBeenCalledWith('despacho-1', dto);
      expect(result.bodega).toBe('Bodega Sur');
    });

    it('should throw NotFoundException when despacho not found', async () => {
      despachoRepository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete despacho', async () => {
      const entity = {
        id: 'despacho-1',
        pedidoId: 'pedido-1',
        bodega: 'Bodega Central',
        horaSalida: new Date(),
        ventanaPrometidaInicio: new Date(),
        ventanaPrometidaFin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      despachoRepository.findById.mockResolvedValue(entity as any);
      despachoRepository.delete.mockResolvedValue(true);

      await service.delete('despacho-1');

      expect(despachoRepository.delete).toHaveBeenCalledWith('despacho-1');
    });

    it('should throw NotFoundException when despacho not found', async () => {
      despachoRepository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
