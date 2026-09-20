import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreatePromocionDto,
  QueryPromocionDto,
  UpdatePromocionDto,
} from '../dtos';
import { PromocionRepository } from '../repositories';
import { PromocionService } from './promocion.service';

describe('PromocionService', () => {
  let service: PromocionService;
  let repository: jest.Mocked<PromocionRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromocionService,
        {
          provide: PromocionRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PromocionService>(PromocionService);
    repository = module.get(PromocionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create promocion and return response', async () => {
      const dto: CreatePromocionDto = {
        nombre: 'Promoción de descuento',
        precioPromocional: 99.99,
        monedaId: '6f8e32fe-bf41-47a7-aa78-5f275c88f4eb',
        productoId: '7ddc3e3d-717e-4256-bd84-1df1f765a0ad',
        tiendaIds: [
          '623c4a0d-a2a4-45c6-808d-858d3794f62f',
          '08a6e58a-16ca-4d97-928a-1d08b53cad9c',
        ],
        inicio: new Date(),
        fin: new Date(),
        restricciones: 2,
      };
      const entity = {
        id: 'promo-1',
        ...dto,
        tiendas: dto.tiendaIds.map((tiendaId) => ({ tiendaId })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(
        expect.objectContaining({
          id: 'promo-1',
          nombre: 'Promoción de descuento',
          tiendaIds: dto.tiendaIds,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return mapped promociones', async () => {
      const query: QueryPromocionDto = {};
      const entities = [
        {
          id: 'promo-1',
          nombre: 'Promo 1',
          precioPromocional: 99.99,
          monedaId: '6f8e32fe-bf41-47a7-aa78-5f275c88f4eb',
          productoId: '7ddc3e3d-717e-4256-bd84-1df1f765a0ad',
          tiendas: [{ tiendaId: '623c4a0d-a2a4-45c6-808d-858d3794f62f' }],
          inicio: new Date(),
          fin: new Date(),
          restricciones: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      repository.findAll.mockResolvedValue(entities as any);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'promo-1',
          tiendaIds: ['623c4a0d-a2a4-45c6-808d-858d3794f62f'],
        }),
      );
    });

    it('should return empty array when no promociones found', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll({});

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return mapped promocion when found', async () => {
      const entity = {
        id: 'promo-1',
        nombre: 'Promoción test',
        precioPromocional: 99.99,
        monedaId: '6f8e32fe-bf41-47a7-aa78-5f275c88f4eb',
        productoId: '7ddc3e3d-717e-4256-bd84-1df1f765a0ad',
        tiendas: [{ tiendaId: '623c4a0d-a2a4-45c6-808d-858d3794f62f' }],
        inicio: new Date(),
        fin: new Date(),
        restricciones: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      const result = await service.findById('promo-1');

      expect(repository.findById).toHaveBeenCalledWith('promo-1');
      expect(result).toEqual(
        expect.objectContaining({
          id: 'promo-1',
          nombre: 'Promoción test',
          tiendaIds: ['623c4a0d-a2a4-45c6-808d-858d3794f62f'],
        }),
      );
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update promocion', async () => {
      const dto: UpdatePromocionDto = {
        nombre: 'Updated Name',
      };
      const entity = {
        id: 'promo-1',
        nombre: 'Original Name',
        precioPromocional: 99.99,
        monedaId: '6f8e32fe-bf41-47a7-aa78-5f275c88f4eb',
        productoId: '7ddc3e3d-717e-4256-bd84-1df1f765a0ad',
        tiendas: [{ tiendaId: '623c4a0d-a2a4-45c6-808d-858d3794f62f' }],
        inicio: new Date(),
        fin: new Date(),
        restricciones: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = { ...entity, nombre: 'Updated Name' };

      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue(updated as any);

      const result = await service.update('promo-1', dto);

      expect(result.nombre).toBe('Updated Name');
    });

    it('should throw NotFoundException when promocion not found', async () => {
      repository.findById.mockResolvedValue(null);

      const dto: UpdatePromocionDto = { nombre: 'Updated' };
      await expect(service.update('non-existent', dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete promocion successfully', async () => {
      const entity = {
        id: 'promo-1',
        nombre: 'Promoción',
        precioPromocional: 99.99,
        monedaId: '6f8e32fe-bf41-47a7-aa78-5f275c88f4eb',
        productoId: '7ddc3e3d-717e-4256-bd84-1df1f765a0ad',
        tiendas: [{ tiendaId: '623c4a0d-a2a4-45c6-808d-858d3794f62f' }],
        inicio: new Date(),
        fin: new Date(),
        restricciones: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);
      repository.delete.mockResolvedValue(true);

      await service.delete('promo-1');

      expect(repository.findById).toHaveBeenCalledWith('promo-1');
      expect(repository.delete).toHaveBeenCalledWith('promo-1');
    });

    it('should throw NotFoundException when promocion not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
