import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePromocionDto,
  PromocionResponseDto,
  QueryPromocionDto,
  UpdatePromocionDto,
} from '../dtos';
import { PromocionRepository } from '../repositories';
import { Promocion } from '../repositories/entities';

@Injectable()
export class PromocionService {
  constructor(private readonly promocionRepository: PromocionRepository) {}

  async create(dto: CreatePromocionDto): Promise<PromocionResponseDto> {
    const promocion = await this.promocionRepository.create(dto);
    return this.mapToResponse(promocion);
  }

  async findAll(query: QueryPromocionDto): Promise<PromocionResponseDto[]> {
    const promociones = await this.promocionRepository.findAll(query);
    return promociones.map((promocion) => this.mapToResponse(promocion));
  }

  async findById(id: string): Promise<PromocionResponseDto> {
    const promocion = await this.promocionRepository.findById(id);
    if (!promocion) {
      throw new NotFoundException(`Promocion con id ${id} no encontrada`);
    }
    return this.mapToResponse(promocion);
  }

  async update(
    id: string,
    dto: UpdatePromocionDto,
  ): Promise<PromocionResponseDto> {
    const promocion = await this.promocionRepository.findById(id);
    if (!promocion) {
      throw new NotFoundException(`Promocion con id ${id} no encontrada`);
    }

    const updatedPromocion = await this.promocionRepository.update(id, dto);
    return this.mapToResponse(updatedPromocion!);
  }

  async delete(id: string): Promise<void> {
    const promocion = await this.promocionRepository.findById(id);
    if (!promocion) {
      throw new NotFoundException(`Promocion con id ${id} no encontrada`);
    }

    await this.promocionRepository.delete(id);
  }

  private mapToResponse(promocion: Promocion): PromocionResponseDto {
    return {
      id: promocion.id,
      nombre: promocion.nombre,
      precioPromocional: parseFloat(promocion.precioPromocional.toString()),
      monedaId: promocion.monedaId,
      productoId: promocion.productoId,
      tiendaIds: promocion.tiendas?.map((tienda) => tienda.tiendaId) ?? [],
      inicio: promocion.inicio,
      fin: promocion.fin,
      restricciones: promocion.restricciones,
      createdAt: promocion.createdAt,
      updatedAt: promocion.updatedAt,
    };
  }
}
