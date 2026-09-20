import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TiendaClientMock } from '../clients';
import {
  CreateProductoExternoDto,
  ProductoExternoResponseDto,
  QueryProductoExternoDto,
  UpdateProductoExternoDto,
} from '../dtos';
import { ProductoExterno } from '../repositories/entities/producto-externo.entity';
import { ProductoExternoRepository } from '../repositories/producto-externo.repository';

@Injectable()
export class ProductoExternoService {
  constructor(
    private readonly productoExternoRepository: ProductoExternoRepository,
    private readonly tiendaClient: TiendaClientMock,
  ) {}

  async create(
    dto: CreateProductoExternoDto,
  ): Promise<ProductoExternoResponseDto> {
    // Validar que la tienda exista
    const tiendaExists = await this.tiendaClient.exists(dto.tiendaId);
    if (!tiendaExists) {
      throw new BadRequestException(`Tienda con id ${dto.tiendaId} no existe`);
    }

    const productoExterno = await this.productoExternoRepository.create(dto);
    return this.mapToResponse(productoExterno);
  }

  async findAll(
    query: QueryProductoExternoDto,
  ): Promise<ProductoExternoResponseDto[]> {
    const productos = await this.productoExternoRepository.findAll(query);
    return productos.map((producto) => this.mapToResponse(producto));
  }

  async findById(id: string): Promise<ProductoExternoResponseDto> {
    const producto = await this.productoExternoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`ProductoExterno con id ${id} no encontrado`);
    }
    return this.mapToResponse(producto);
  }

  async update(
    id: string,
    dto: UpdateProductoExternoDto,
  ): Promise<ProductoExternoResponseDto> {
    const producto = await this.productoExternoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`ProductoExterno con id ${id} no encontrado`);
    }

    // Si se actualiza el tiendaId, validar que exista
    if (dto.tiendaId && dto.tiendaId !== producto.tiendaId) {
      const tiendaExists = await this.tiendaClient.exists(dto.tiendaId);
      if (!tiendaExists) {
        throw new BadRequestException(
          `Tienda con id ${dto.tiendaId} no existe`,
        );
      }
    }

    const updatedProducto = await this.productoExternoRepository.update(
      id,
      dto,
    );
    return this.mapToResponse(updatedProducto!);
  }

  async delete(id: string): Promise<void> {
    const producto = await this.productoExternoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`ProductoExterno con id ${id} no encontrado`);
    }

    await this.productoExternoRepository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const producto = await this.productoExternoRepository.findById(id);
    return !!producto;
  }

  private mapToResponse(producto: ProductoExterno): ProductoExternoResponseDto {
    return {
      id: producto.id,
      tiendaId: producto.tiendaId,
      codigoBarras: producto.codigoBarras,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precioBase: parseFloat(producto.precioBase.toString()),
      monedaId: producto.monedaId,
      cantidad: parseFloat(producto.cantidad.toString()),
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt,
    };
  }
}
