import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryDisponibilidadZonaDto } from '../dtos';
import { DisponibilidadZona } from './entities';

@Injectable()
export class DisponibilidadZonaRepository {
  constructor(
    @Inject('DISPONIBILIDAD_ZONA_REPOSITORY')
    private repository: Repository<DisponibilidadZona>,
  ) {}

  async create(
    disponibilidad: Partial<DisponibilidadZona>,
  ): Promise<DisponibilidadZona> {
    const newDisponibilidad = this.repository.create({
      ...disponibilidad,
      ultimaActualizacion: new Date(),
    });
    return this.repository.save(newDisponibilidad);
  }

  async findAll(
    query: QueryDisponibilidadZonaDto,
  ): Promise<DisponibilidadZona[]> {
    const queryBuilder =
      this.repository.createQueryBuilder('disponibilidadZona');

    if (query.catalogoId) {
      queryBuilder.andWhere('disponibilidadZona.catalogoId = :catalogoId', {
        catalogoId: query.catalogoId,
      });
    }

    if (query.productoId) {
      queryBuilder.andWhere('disponibilidadZona.productoId = :productoId', {
        productoId: query.productoId,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<DisponibilidadZona | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByCatalogoAndProducto(
    catalogoId: string,
    productoId: string,
  ): Promise<DisponibilidadZona | null> {
    return this.repository.findOne({ where: { catalogoId, productoId } });
  }

  async update(
    id: string,
    updates: Partial<DisponibilidadZona>,
  ): Promise<DisponibilidadZona | null> {
    await this.repository.update(id, {
      ...updates,
      ultimaActualizacion: new Date(),
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
