import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryPromocionDto } from '../dtos';
import { Promocion, PromocionTienda } from './entities';

@Injectable()
export class PromocionRepository {
  constructor(
    @Inject('PROMOCION_REPOSITORY')
    private repository: Repository<Promocion>,
  ) {}

  async create(promocion: Partial<Promocion>): Promise<Promocion> {
    const tiendaIds = this.normalizeTiendaIds(
      (promocion as Partial<Promocion> & { tiendaIds?: string[] }).tiendaIds,
    );
    const newPromocion = this.repository.create({
      ...promocion,
      tiendas: tiendaIds.map((tiendaId) => ({ tiendaId } as PromocionTienda)),
    });
    return this.repository.save(newPromocion);
  }

  async findAll(query: QueryPromocionDto): Promise<Promocion[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('promocion')
      .leftJoinAndSelect('promocion.tiendas', 'tiendas');

    if (query.nombre) {
      queryBuilder.andWhere('promocion.nombre LIKE :nombre', {
        nombre: `%${query.nombre}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Promocion | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
  }

  async update(
    id: string,
    updates: Partial<Promocion>,
  ): Promise<Promocion | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private normalizeTiendaIds(tiendaIds?: string[]): string[] {
    return [...new Set(tiendaIds ?? [])];
  }
}
