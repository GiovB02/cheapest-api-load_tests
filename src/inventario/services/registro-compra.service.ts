import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients/tienda.client.mock';
import {
  CreateRegistroCompraDto,
  QueryRegistroCompraDto,
  RegistroCompraResponseDto,
  UpdateRegistroCompraDto,
} from '../dtos';
import { RegistroCompraProductoTienda } from '../repositories/entities/registro-compra-producto-tienda.entity';
import { ItemInventarioRepository } from '../repositories/item-inventario.repository';
import { RegistroCompraRepository } from '../repositories/registro-compra.repository';

@Injectable()
export class RegistroCompraService {
  constructor(
    private readonly registroRepository: RegistroCompraRepository,
    private readonly itemRepository: ItemInventarioRepository,
    private readonly productoService: ProductoService,
    private readonly tiendaClient: TiendaClientMock,
  ) {}

  async create(
    dto: CreateRegistroCompraDto,
  ): Promise<RegistroCompraResponseDto> {
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

    // Validar que el item inventario exista
    const item = await this.itemRepository.findById(dto.itemInventarioId);
    if (!item) {
      throw new BadRequestException(
        `ItemInventario con id ${dto.itemInventarioId} no encontrado`,
      );
    }

    // Validar coherencia: el item debe pertenecer al mismo producto y tienda
    if (item.productoId !== dto.productoId) {
      throw new BadRequestException(
        `El itemInventario ${dto.itemInventarioId} no pertenece al producto ${dto.productoId}`,
      );
    }

    if (item.tiendaId !== dto.tiendaId) {
      throw new BadRequestException(
        `El itemInventario ${dto.itemInventarioId} no pertenece a la tienda ${dto.tiendaId}`,
      );
    }

    // Crear registro de compra
    const registro = await this.registroRepository.create(
      dto as Partial<RegistroCompraProductoTienda>,
    );

    // Incrementar cantidad en inventario
    await this.itemRepository.incrementCantidad(
      dto.itemInventarioId,
      dto.cantidad,
    );

    return this.mapToResponse(registro);
  }

  async findAll(
    query: QueryRegistroCompraDto,
  ): Promise<RegistroCompraResponseDto[]> {
    const registros = await this.registroRepository.findAll(query);
    return registros.map((registro) => this.mapToResponse(registro));
  }

  async findById(id: string): Promise<RegistroCompraResponseDto> {
    const registro = await this.registroRepository.findById(id);
    if (!registro) {
      throw new NotFoundException(`RegistroCompra con id ${id} no encontrado`);
    }
    return this.mapToResponse(registro);
  }

  async update(
    id: string,
    dto: UpdateRegistroCompraDto,
  ): Promise<RegistroCompraResponseDto> {
    const registro = await this.registroRepository.findById(id);
    if (!registro) {
      throw new NotFoundException(`RegistroCompra con id ${id} no encontrado`);
    }

    const updatedRegistro = await this.registroRepository.update(id, dto);
    return this.mapToResponse(updatedRegistro!);
  }

  async delete(id: string): Promise<void> {
    const registro = await this.registroRepository.findById(id);
    if (!registro) {
      throw new NotFoundException(`RegistroCompra con id ${id} no encontrado`);
    }

    // Al eliminar, decrementar la cantidad del inventario
    await this.itemRepository.decrementCantidad(
      registro.itemInventarioId,
      registro.cantidad,
    );

    await this.registroRepository.delete(id);
  }

  private mapToResponse(
    registro: RegistroCompraProductoTienda,
  ): RegistroCompraResponseDto {
    return {
      id: registro.id,
      tiendaId: registro.tiendaId,
      productoId: registro.productoId,
      compraId: registro.compraId,
      itemInventarioId: registro.itemInventarioId,
      fechaCompra: registro.fechaCompra,
      cantidad: registro.cantidad,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt,
    };
  }
}
