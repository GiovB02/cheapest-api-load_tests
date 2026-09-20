import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductoService } from '../../logistica/services/producto.service';
import { TiendaClientMock } from '../clients';
import {
  CreateVentaDto,
  ItemVentaResponseDto,
  QueryVentaDto,
  UpdateVentaDto,
  VentaResponseDto,
} from '../dtos';
import { ItemVenta } from '../repositories/entities/item-venta.entity';
import { Venta } from '../repositories/entities/venta.entity';
import { ProductoExternoRepository } from '../repositories/producto-externo.repository';
import { VentaRepository } from '../repositories/venta.repository';

@Injectable()
export class VentaService {
  constructor(
    private readonly ventaRepository: VentaRepository,
    private readonly productoExternoRepository: ProductoExternoRepository,
    private readonly tiendaClient: TiendaClientMock,
    private readonly productoService: ProductoService,
  ) {}

  async create(dto: CreateVentaDto): Promise<VentaResponseDto> {
    // Validar que la tienda exista
    const tiendaExists = await this.tiendaClient.exists(dto.tiendaId);
    if (!tiendaExists) {
      throw new BadRequestException(`Tienda con id ${dto.tiendaId} no existe`);
    }

    // Validar que todos los productos externos existan
    for (const item of dto.items) {
      const productoExists = await this.productoExternoRepository.findById(
        item.productoExternoId,
      );
      if (!productoExists) {
        throw new BadRequestException(
          `ProductoExterno con id ${item.productoExternoId} no existe`,
        );
      }

      // Validar que el producto del catálogo exista si se proporciona productoId
      if (item.productoId) {
        try {
          await this.productoService.findById(item.productoId);
        } catch {
          throw new BadRequestException(
            `Producto con id ${item.productoId} no existe`,
          );
        }
      }
    }

    // Calcular el total a partir de los items
    const total = dto.items.reduce(
      (sum, item) => sum + item.cantidad * item.precioUnitario,
      0,
    );

    // Crear la venta con sus items (cascade)

    const venta = await this.ventaRepository.create({
      tiendaId: dto.tiendaId,
      fechaHora: dto.fechaHora,
      total,
      monedaId: dto.monedaId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      items: dto.items.map((item) => ({
        productoExternoId: item.productoExternoId || null,
        productoId: item.productoId || null,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        monedaId: dto.monedaId,
      })) as any,
    });

    return this.mapToResponse(venta);
  }

  async findAll(query: QueryVentaDto): Promise<VentaResponseDto[]> {
    const ventas = await this.ventaRepository.findAll(query);
    return ventas.map((venta) => this.mapToResponse(venta));
  }

  async findById(id: string): Promise<VentaResponseDto> {
    const venta = await this.ventaRepository.findById(id);
    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return this.mapToResponse(venta);
  }

  async update(id: string, dto: UpdateVentaDto): Promise<VentaResponseDto> {
    const venta = await this.ventaRepository.findById(id);
    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }

    // Si se actualizan los items, validar productos externos
    if (dto.items) {
      for (const item of dto.items) {
        const productoExists = await this.productoExternoRepository.findById(
          item.productoExternoId,
        );
        if (!productoExists) {
          throw new BadRequestException(
            `ProductoExterno con id ${item.productoExternoId} no existe`,
          );
        }

        // Validar que el producto del catálogo exista si se proporciona productoId
        if (item.productoId) {
          try {
            await this.productoService.findById(item.productoId);
          } catch {
            throw new BadRequestException(
              `Producto con id ${item.productoId} no existe`,
            );
          }
        }
      }

      // Recalcular el total
      const newTotal = dto.items.reduce(
        (sum, item) => sum + item.cantidad * item.precioUnitario,
        0,
      );

      // Actualizar items: eliminar los antiguos y crear los nuevos

      const updatedVenta = await this.ventaRepository.update(id, {
        ...dto,
        total: newTotal,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        items: dto.items.map((item) => ({
          productoExternoId: item.productoExternoId,
          productoId: item.productoId || null,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          monedaId: venta.monedaId,
        })) as any,
      });

      return this.mapToResponse(updatedVenta!);
    }

    // Si solo se actualiza fechaHora
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const updatedVenta = await this.ventaRepository.update(id, dto as any);
    return this.mapToResponse(updatedVenta!);
  }

  async delete(id: string): Promise<void> {
    const venta = await this.ventaRepository.findById(id);
    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }

    await this.ventaRepository.delete(id);
  }

  private mapToResponse(venta: Venta): VentaResponseDto {
    return {
      id: venta.id,
      tiendaId: venta.tiendaId,
      fechaHora: venta.fechaHora,
      total: parseFloat(venta.total.toString()),
      monedaId: venta.monedaId,
      items: (venta.items || []).map((item) => this.mapItemToResponse(item)),
      createdAt: venta.createdAt,
      updatedAt: venta.updatedAt,
    };
  }

  private mapItemToResponse(item: ItemVenta): ItemVentaResponseDto {
    return {
      id: item.id,
      ventaId: item.ventaId,
      productoExternoId: item.productoExternoId || undefined,
      productoId: item.productoId || undefined,
      cantidad: item.cantidad,
      precioUnitario: parseFloat(item.precioUnitario.toString()),
      monedaId: item.monedaId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
