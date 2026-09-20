import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateDisponibilidadZonaDto,
  QueryDisponibilidadZonaDto,
  UpdateDisponibilidadZonaDto,
} from '../dtos';
import {
  CatalogoRepository,
  DisponibilidadZonaRepository,
  ProductoRepository,
} from '../repositories';
import { DisponibilidadZonaService } from './disponibilidad-zona.service';

describe('DisponibilidadZonaService', () => {
  let service: DisponibilidadZonaService;
  let repository: jest.Mocked<DisponibilidadZonaRepository>;
  let catalogoRepository: jest.Mocked<CatalogoRepository>;
  let productoRepository: jest.Mocked<ProductoRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCatalogoAndProducto: jest.fn(),
    };

    const mockCatalogoRepository = {
      findById: jest.fn(),
    };

    const mockProductoRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisponibilidadZonaService,
        {
          provide: DisponibilidadZonaRepository,
          useValue: mockRepository,
        },
        {
          provide: CatalogoRepository,
          useValue: mockCatalogoRepository,
        },
        {
          provide: ProductoRepository,
          useValue: mockProductoRepository,
        },
      ],
    }).compile();

    service = module.get<DisponibilidadZonaService>(DisponibilidadZonaService);
    repository = module.get(DisponibilidadZonaRepository);
    catalogoRepository = module.get(CatalogoRepository);
    productoRepository = module.get(ProductoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create disponibilidad when catalogo and producto exist', async () => {
      const dto: CreateDisponibilidadZonaDto = {
        catalogoId: 'cat-1',
        productoId: 'prod-1',
        zona: 'ZONA_NORTE',
        esDisponible: true,
        horaInicio: '08:00',
        horaFin: '20:00',
      } as any;
      const catalogo = { id: 'cat-1' };
      const producto = { id: 'prod-1' };
      const entity = {
        id: 'dz-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      catalogoRepository.findById.mockResolvedValue(catalogo as any);
      productoRepository.findById.mockResolvedValue(producto as any);
      repository.findByCatalogoAndProducto.mockResolvedValue(null);
      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(catalogoRepository.findById).toHaveBeenCalledWith('cat-1');
      expect(productoRepository.findById).toHaveBeenCalledWith('prod-1');
      expect(result).toEqual(
        expect.objectContaining({
          id: 'dz-1',
        }),
      );
    });

    it('should throw BadRequestException when catalogo not found', async () => {
      const dto: CreateDisponibilidadZonaDto = {
        catalogoId: 'non-existent',
        productoId: 'prod-1',
        zona: 'ZONA_NORTE',
        esDisponible: true,
        horaInicio: '08:00',
        horaFin: '20:00',
      } as any;

      catalogoRepository.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return mapped disponibilidades', async () => {
      const query: QueryDisponibilidadZonaDto = {};
      const entities = [
        {
          id: 'dz-1',
          zona: 'ZONA_NORTE',
          esDisponible: true,
          horaInicio: '08:00',
          horaFin: '20:00',
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
    it('should return disponibilidad when found', async () => {
      const entity = {
        id: 'dz-1',
        zona: 'ZONA_NORTE',
        esDisponible: true,
        horaInicio: '08:00',
        horaFin: '20:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      const result = await service.findById('dz-1');

      expect(result.id).toBe('dz-1');
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return disponibilidad', async () => {
      const dto: UpdateDisponibilidadZonaDto = { cantidadDisponible: 50 };
      const entity = {
        id: 'dz-1',
        catalogoId: 'cat-1',
        productoId: 'prod-1',
        cantidadDisponible: 100,
        ultimaActualizacion: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = { ...entity, cantidadDisponible: 50 };

      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue(updated as any);

      const result = await service.update('dz-1', dto);

      expect(result.cantidadDisponible).toBe(50);
    });
  });

  describe('delete', () => {
    it('should delete disponibilidad', async () => {
      const entity = {
        id: 'dz-1',
        catalogoId: 'cat-1',
        productoId: 'prod-1',
        cantidadDisponible: 100,
        ultimaActualizacion: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(entity as any);

      await service.delete('dz-1');

      expect(repository.delete).toHaveBeenCalledWith('dz-1');
    });
  });
});
