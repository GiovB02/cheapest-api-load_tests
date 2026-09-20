import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductoDto,
  ProductoResponseDto,
  QueryProductoDto,
  UpdateProductoDto,
} from '../dtos';
import { ProductoRepository } from '../repositories';
import { Producto } from '../repositories/entities';

@Injectable()
export class ProductoService {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async create(dto: CreateProductoDto): Promise<ProductoResponseDto> {
    const producto = await this.productoRepository.create(dto);
    return this.mapToResponse(producto);
  }

  async findAll(query: QueryProductoDto): Promise<ProductoResponseDto[]> {
    const productos = await this.productoRepository.findAll(query);
    return productos.map((producto) => this.mapToResponse(producto));
  }

  async findById(id: string): Promise<ProductoResponseDto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return this.mapToResponse(producto);
  }

  async update(
    id: string,
    dto: UpdateProductoDto,
  ): Promise<ProductoResponseDto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    const updatedProducto = await this.productoRepository.update(id, dto);
    return this.mapToResponse(updatedProducto!);
  }

  async delete(id: string): Promise<void> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    await this.productoRepository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const producto = await this.productoRepository.findById(id);
    return producto !== null;
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
