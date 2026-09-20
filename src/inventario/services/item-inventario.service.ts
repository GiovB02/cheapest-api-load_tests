import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients/tienda.client.mock';
import {
  CreateItemInventarioDto,
  ItemInventarioResponseDto,
  QueryItemInventarioDto,
  UpdateItemInventarioDto,
} from '../dtos';
import { ItemInventario } from '../repositories/entities/item-inventario.entity';
import { ItemInventarioRepository } from '../repositories/item-inventario.repository';

@Injectable()
export class ItemInventarioService {
  constructor(
    private readonly itemRepository: ItemInventarioRepository,
    private readonly productoService: ProductoService,
    private readonly tiendaClient: TiendaClientMock,
  ) {}

  async create(
    dto: CreateItemInventarioDto,
  ): Promise<ItemInventarioResponseDto> {
    // Validar que producto y tienda existan
    const productoExists = await this.productoService.exists(dto.productoId);
    if (!productoExists) {
      throw new BadRequestException(
        `Producto con id ${dto.productoId} no existe`,
      );
    }

    const tiendaExists = await this.tiendaClient.exists(dto.tiendaId);
    if (!tiendaExists) {
      throw new BadRequestException(`Tienda con id ${dto.tiendaId} no existe`);
    }

    const item = await this.itemRepository.create(dto);
    return this.mapToResponse(item);
  }

  async findAll(
    query: QueryItemInventarioDto,
  ): Promise<ItemInventarioResponseDto[]> {
    const items = await this.itemRepository.findAll(query);
    return items.map((item) => this.mapToResponse(item));
  }

  async findById(id: string): Promise<ItemInventarioResponseDto> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`ItemInventario con id ${id} no encontrado`);
    }
    return this.mapToResponse(item);
  }

  async update(
    id: string,
    dto: UpdateItemInventarioDto,
  ): Promise<ItemInventarioResponseDto> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`ItemInventario con id ${id} no encontrado`);
    }

    const updatedItem = await this.itemRepository.update(id, dto);
    return this.mapToResponse(updatedItem!);
  }

  async delete(id: string): Promise<void> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`ItemInventario con id ${id} no encontrado`);
    }

    await this.itemRepository.delete(id);
  }

  async checkDisponibilidad(
    itemInventarioId: string,
    cantidadRequerida: number,
  ): Promise<boolean> {
    const item = await this.itemRepository.findById(itemInventarioId);
    if (!item) {
      return false;
    }
    return item.cantidad >= cantidadRequerida;
  }

  private mapToResponse(item: ItemInventario): ItemInventarioResponseDto {
    return {
      id: item.id,
      productoId: item.productoId,
      tiendaId: item.tiendaId,
      cantidad: item.cantidad,
      precioVenta: parseFloat(item.precioVenta.toString()),
      monedaId: item.monedaId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
