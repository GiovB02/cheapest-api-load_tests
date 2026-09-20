import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TiendaClientMock } from '../clients';
import {
  CreatePedidoDto,
  ItemPedidoResponseDto,
  PedidoResponseDto,
  QueryPedidoDto,
  UpdatePedidoDto,
} from '../dtos';
import { PedidoRepository, ProductoRepository } from '../repositories';
import { ItemPedido, Pedido } from '../repositories/entities';

@Injectable()
export class PedidoService {
  constructor(
    private readonly pedidoRepository: PedidoRepository,
    private readonly productoRepository: ProductoRepository,
    private readonly tiendaClient: TiendaClientMock,
  ) {}

  async create(dto: CreatePedidoDto): Promise<PedidoResponseDto> {
    // Validar que la tienda existe
    const tiendaExists = await this.tiendaClient.exists(dto.tiendaId);
    if (!tiendaExists) {
      throw new BadRequestException(`Tienda con id ${dto.tiendaId} no existe`);
    }

    // Validar que todos los productos existen
    for (const item of dto.items) {
      const producto = await this.productoRepository.findById(item.productoId);
      if (!producto) {
        throw new BadRequestException(
          `Producto con id ${item.productoId} no existe`,
        );
      }
    }

    // Crear pedido con items
    const pedidoData: Partial<Pedido> = {
      identificador: dto.identificador,
      tiendaId: dto.tiendaId,
      fechaHoraCreacion: dto.fechaHoraCreacion,
      montoTotal: dto.montoTotal,
      monedaId: dto.monedaId,
      estado: dto.estado,
      items: dto.items as ItemPedido[],
    };

    const pedido = await this.pedidoRepository.create(pedidoData);
    return this.mapToResponse(pedido);
  }

  async findAll(query: QueryPedidoDto): Promise<PedidoResponseDto[]> {
    const pedidos = await this.pedidoRepository.findAll(query);
    return pedidos.map((pedido) => this.mapToResponse(pedido));
  }

  async findById(id: string): Promise<PedidoResponseDto> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }
    return this.mapToResponse(pedido);
  }

  async update(id: string, dto: UpdatePedidoDto): Promise<PedidoResponseDto> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    const updatedPedido = await this.pedidoRepository.update(id, dto);
    return this.mapToResponse(updatedPedido!);
  }

  async delete(id: string): Promise<void> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    await this.pedidoRepository.delete(id);
  }

  private mapToResponse(pedido: Pedido): PedidoResponseDto {
    return {
      id: pedido.id,
      identificador: pedido.identificador,
      tiendaId: pedido.tiendaId,
      fechaHoraCreacion: pedido.fechaHoraCreacion,
      montoTotal: pedido.montoTotal,
      monedaId: pedido.monedaId,
      estado: pedido.estado,
      items: pedido.items?.map((item) => this.mapItemToResponse(item)),
      createdAt: pedido.createdAt,
      updatedAt: pedido.updatedAt,
    };
  }

  private mapItemToResponse(item: ItemPedido): ItemPedidoResponseDto {
    return {
      id: item.id,
      pedidoId: item.pedidoId,
      productoId: item.productoId,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      descuento: item.descuento,
      monedaId: item.monedaId,
      lote: item.lote,
      fechaVencimiento: item.fechaVencimiento,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
