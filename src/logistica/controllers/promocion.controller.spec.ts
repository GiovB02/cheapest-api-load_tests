import { Test, TestingModule } from '@nestjs/testing';
import {
  CreatePromocionDto,
  QueryPromocionDto,
  UpdatePromocionDto,
} from '../dtos';
import { PromocionService } from '../services';
import { PromocionController } from './promocion.controller';

describe('PromocionController', () => {
  let controller: PromocionController;
  let service: jest.Mocked<PromocionService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromocionController],
      providers: [
        {
          provide: PromocionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PromocionController>(PromocionController);
    service = module.get(PromocionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreatePromocionDto = {
        nombre: 'Promo 10% OFF',
        precioPromocional: 90,
        monedaId: 'usd-1',
        inicio: new Date(),
        fin: new Date(),
        restricciones: 2,
      };
      const response = {
        id: 'promo-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const query: QueryPromocionDto = {};
      const response = [
        {
          id: 'promo-1',
          nombre: 'Promo 10% OFF',
          precioPromocional: 90,
          monedaId: 'usd-1',
          inicio: new Date(),
          fin: new Date(),
          restricciones: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findAll.mockResolvedValue(response);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      const response = {
        id: 'promo-1',
        nombre: 'Promo 10% OFF',
        precioPromocional: 90,
        monedaId: 'usd-1',
        inicio: new Date(),
        fin: new Date(),
        restricciones: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(response);

      const result = await controller.findById('promo-1');

      expect(service.findById).toHaveBeenCalledWith('promo-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdatePromocionDto = { nombre: 'Actualizada' };
      const response = {
        id: 'promo-1',
        nombre: 'Actualizada',
        precioPromocional: 90,
        monedaId: 'usd-1',
        inicio: new Date(),
        fin: new Date(),
        restricciones: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(response);

      const result = await controller.update('promo-1', dto);

      expect(service.update).toHaveBeenCalledWith('promo-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('promo-1');

      expect(service.delete).toHaveBeenCalledWith('promo-1');
    });
  });
});
