import { Injectable } from '@nestjs/common';
import { ProductoResponseDto, QueryProductosDisponiblesDto } from '../dtos';
import { ProductoRepository } from '../repositories';
import { Producto } from '../repositories/entities';

@Injectable()
export class TenderoService {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async getProductosDisponibles(
    dto: QueryProductosDisponiblesDto,
  ): Promise<ProductoResponseDto[]> {
    const { tiendaId, zona } = dto as { tiendaId: string; zona: string };
    const productos =
      await this.productoRepository.findProductosDisponiblesParaTendero(
        tiendaId,
        zona,
      );
    return productos.map((p) => this.mapToResponse(p));
  }

  private mapToResponse(producto: Producto): ProductoResponseDto {
    return {
      id: producto.id,
      codigoInterno: producto.codigoInterno,
      codigoBarras: producto.codigoBarras,
      nombre: producto.nombre,
      marca: producto.marca,
      categoria: producto.categoria,
      presentacion: producto.presentacion,
      precioBase: producto.precioBase,
      monedaId: producto.monedaId,
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt,
    };
  }
}
