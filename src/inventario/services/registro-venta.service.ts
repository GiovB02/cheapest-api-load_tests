import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients/tienda.client.mock';
import {
  CreateRegistroVentaDto,
  QueryRegistroVentaDto,
  RegistroVentaResponseDto,
  UpdateRegistroVentaDto,
} from '../dtos';
import { RegistroVentaProductoTienda } from '../repositories/entities/registro-venta-producto-tienda.entity';
import { ItemInventarioRepository } from '../repositories/item-inventario.repository';
import { RegistroVentaRepository } from '../repositories/registro-venta.repository';

@Injectable()
export class RegistroVentaService {
  constructor(
    private readonly registroRepository: RegistroVentaRepository,
    private readonly itemRepository: ItemInventarioRepository,
    private readonly productoService: ProductoService,
    private readonly tiendaClient: TiendaClientMock,
  ) {}

  async create(dto: CreateRegistroVentaDto): Promise<RegistroVentaResponseDto> {
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

    // Validar que hay suficiente cantidad
    if (item.cantidad < dto.cantidad) {
      throw new BadRequestException(
        `Cantidad insuficiente en inventario. Disponible: ${item.cantidad}, Requerido: ${dto.cantidad}`,
      );
    }

    // Crear registro de venta
    const registro = await this.registroRepository.create(
      dto as Partial<RegistroVentaProductoTienda>,
    );

    // Decrementar cantidad en inventario
    await this.itemRepository.decrementCantidad(
      dto.itemInventarioId,
      dto.cantidad,
    );

    return this.mapToResponse(registro);
  }

  async findAll(
    query: QueryRegistroVentaDto,
  ): Promise<RegistroVentaResponseDto[]> {
    const registros = await this.registroRepository.findAll(query);
    return registros.map((registro) => this.mapToResponse(registro));
  }

  async findById(id: string): Promise<RegistroVentaResponseDto> {
    const registro = await this.registroRepository.findById(id);
    if (!registro) {
      throw new NotFoundException(`RegistroVenta con id ${id} no encontrado`);
    }
    return this.mapToResponse(registro);
  }

  async update(
    id: string,
    dto: UpdateRegistroVentaDto,
  ): Promise<RegistroVentaResponseDto> {
    const registro = await this.registroRepository.findById(id);
    if (!registro) {
      throw new NotFoundException(`RegistroVenta con id ${id} no encontrado`);
    }

    const updatedRegistro = await this.registroRepository.update(
      id,
      dto as Partial<RegistroVentaProductoTienda>,
    );
    return this.mapToResponse(updatedRegistro!);
  }

  async delete(id: string): Promise<void> {
    const registro = await this.registroRepository.findById(id);
    if (!registro) {
      throw new NotFoundException(`RegistroVenta con id ${id} no encontrado`);
    }

    // Al eliminar, devolver la cantidad al inventario
    await this.itemRepository.incrementCantidad(
      registro.itemInventarioId,
      registro.cantidad,
    );

    await this.registroRepository.delete(id);
  }

  private mapToResponse(
    registro: RegistroVentaProductoTienda,
  ): RegistroVentaResponseDto {
    return {
      id: registro.id,
      tiendaId: registro.tiendaId,
      productoId: registro.productoId,
      ventaId: registro.ventaId,
      itemInventarioId: registro.itemInventarioId,
      fechaVenta: registro.fechaVenta,
      cantidad: registro.cantidad,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt,
    };
  }
}
