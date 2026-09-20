import { Test, TestingModule } from '@nestjs/testing';
import {
  CreatePedidoDto,
  PedidoResponseDto,
  QueryPedidoDto,
  UpdatePedidoDto,
} from '../dtos';
import { EstadoPedido } from '../repositories/entities';
import { PedidoService } from '../services';
import { PedidoController } from './pedido.controller';

describe('PedidoController', () => {
  let controller: PedidoController;
  let service: jest.Mocked<PedidoService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoController],
      providers: [
        {
          provide: PedidoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PedidoController>(PedidoController);
    service = module.get(PedidoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreatePedidoDto = {
        identificador: 'PED-001',
        tiendaId: 'tienda-1',
        fechaHoraCreacion: new Date(),
        montoTotal: 1000,
        monedaId: 'usd-1',
        estado: EstadoPedido.CREADO,
        items: [
          {
            productoId: 'prod-1',
            cantidad: 2,
            precioUnitario: 500,
            descuento: 0,
            monedaId: 'usd-1',
          },
        ],
      };

      const response: PedidoResponseDto = {
        id: 'ped-1',
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
    it('should call service.findAll with query', async () => {
      const query: QueryPedidoDto = { tiendaId: 'tienda-1' };
      const response = [
        {
          id: 'ped-1',
          identificador: 'PED-001',
          tiendaId: 'tienda-1',
          fechaHoraCreacion: new Date(),
          montoTotal: 1000,
          monedaId: 'usd-1',
          estado: EstadoPedido.APROBADO,
          items: [],
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
      const response: PedidoResponseDto = {
        id: 'ped-1',
        identificador: 'PED-001',
        tiendaId: 'tienda-1',
        fechaHoraCreacion: new Date(),
        montoTotal: 1000,
        monedaId: 'usd-1',
        estado: EstadoPedido.ALISTADO,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(response);

      const result = await controller.findById('ped-1');

      expect(service.findById).toHaveBeenCalledWith('ped-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdatePedidoDto = { estado: EstadoPedido.DESPACHADO };
      const response: PedidoResponseDto = {
        id: 'ped-1',
        identificador: 'PED-001',
        tiendaId: 'tienda-1',
        fechaHoraCreacion: new Date(),
        montoTotal: 1000,
        monedaId: 'usd-1',
        estado: EstadoPedido.DESPACHADO,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(response);

      const result = await controller.update('ped-1', dto);

      expect(service.update).toHaveBeenCalledWith('ped-1', dto);
      expect(result).toEqual(response);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('ped-1');

      expect(service.delete).toHaveBeenCalledWith('ped-1');
    });
  });
});
