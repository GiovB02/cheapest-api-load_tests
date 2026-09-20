import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryCatalogoDto } from '../dtos';
import { Catalogo } from './entities';

@Injectable()
export class CatalogoRepository {
  constructor(
    @Inject('CATALOGO_REPOSITORY')
    private repository: Repository<Catalogo>,
  ) {}

  async create(catalogo: Partial<Catalogo>): Promise<Catalogo> {
    const newCatalogo = this.repository.create(catalogo);
    return this.repository.save(newCatalogo);
  }

  async findAll(query: QueryCatalogoDto): Promise<Catalogo[]> {
    const queryBuilder = this.repository.createQueryBuilder('catalogo');

    if (query.tiendaId) {
      queryBuilder.andWhere('catalogo.tiendaId = :tiendaId', {
        tiendaId: query.tiendaId,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Catalogo | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<Catalogo>,
  ): Promise<Catalogo | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
