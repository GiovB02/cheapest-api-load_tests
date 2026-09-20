import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDisponibilidadZonaDto,
  DisponibilidadZonaResponseDto,
  QueryDisponibilidadZonaDto,
  UpdateDisponibilidadZonaDto,
} from '../dtos';
import {
  CatalogoRepository,
  DisponibilidadZonaRepository,
  ProductoRepository,
} from '../repositories';
import { DisponibilidadZona } from '../repositories/entities';

@Injectable()
export class DisponibilidadZonaService {
  constructor(
    private readonly disponibilidadZonaRepository: DisponibilidadZonaRepository,
    private readonly catalogoRepository: CatalogoRepository,
    private readonly productoRepository: ProductoRepository,
  ) {}

  async create(
    dto: CreateDisponibilidadZonaDto,
  ): Promise<DisponibilidadZonaResponseDto> {
    // Validar que el catalogo existe
    const catalogo = await this.catalogoRepository.findById(dto.catalogoId);
    if (!catalogo) {
      throw new BadRequestException(
        `Catalogo con id ${dto.catalogoId} no existe`,
      );
    }

    // Validar que el producto existe
    const producto = await this.productoRepository.findById(dto.productoId);
    if (!producto) {
      throw new BadRequestException(
        `Producto con id ${dto.productoId} no existe`,
      );
    }

    // Validar que no existe ya una disponibilidad para este catalogo y producto
    const exists =
      await this.disponibilidadZonaRepository.findByCatalogoAndProducto(
        dto.catalogoId,
        dto.productoId,
      );
    if (exists) {
      throw new BadRequestException(
        `Ya existe una disponibilidad para el catalogo ${dto.catalogoId} y producto ${dto.productoId}`,
      );
    }

    const disponibilidad = await this.disponibilidadZonaRepository.create(dto);
    return this.mapToResponse(disponibilidad);
  }

  async findAll(
    query: QueryDisponibilidadZonaDto,
  ): Promise<DisponibilidadZonaResponseDto[]> {
    const disponibilidades =
      await this.disponibilidadZonaRepository.findAll(query);
    return disponibilidades.map((disponibilidad) =>
      this.mapToResponse(disponibilidad),
    );
  }

  async findById(id: string): Promise<DisponibilidadZonaResponseDto> {
    const disponibilidad = await this.disponibilidadZonaRepository.findById(id);
    if (!disponibilidad) {
      throw new NotFoundException(
        `DisponibilidadZona con id ${id} no encontrada`,
      );
    }
    return this.mapToResponse(disponibilidad);
  }

  async update(
    id: string,
    dto: UpdateDisponibilidadZonaDto,
  ): Promise<DisponibilidadZonaResponseDto> {
    const disponibilidad = await this.disponibilidadZonaRepository.findById(id);
    if (!disponibilidad) {
      throw new NotFoundException(
        `DisponibilidadZona con id ${id} no encontrada`,
      );
    }

    const updatedDisponibilidad =
      await this.disponibilidadZonaRepository.update(id, dto);
    return this.mapToResponse(updatedDisponibilidad!);
  }

  async delete(id: string): Promise<void> {
    const disponibilidad = await this.disponibilidadZonaRepository.findById(id);
    if (!disponibilidad) {
      throw new NotFoundException(
        `DisponibilidadZona con id ${id} no encontrada`,
      );
    }

    await this.disponibilidadZonaRepository.delete(id);
  }

  private mapToResponse(
    disponibilidad: DisponibilidadZona,
  ): DisponibilidadZonaResponseDto {
    return {
      id: disponibilidad.id,
      catalogoId: disponibilidad.catalogoId,
      productoId: disponibilidad.productoId,
      cantidadDisponible: disponibilidad.cantidadDisponible,
      ultimaActualizacion: disponibilidad.ultimaActualizacion,
      createdAt: disponibilidad.createdAt,
      updatedAt: disponibilidad.updatedAt,
    };
  }
}
