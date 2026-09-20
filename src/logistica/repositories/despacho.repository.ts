import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryDespachoDto } from '../dtos';
import { Despacho } from './entities';

@Injectable()
export class DespachoRepository {
  constructor(
    @Inject('DESPACHO_REPOSITORY')
    private repository: Repository<Despacho>,
  ) {}

  async create(despacho: Partial<Despacho>): Promise<Despacho> {
    const newDespacho = this.repository.create(despacho);
    return this.repository.save(newDespacho);
  }

  async findAll(query: QueryDespachoDto): Promise<Despacho[]> {
    const queryBuilder = this.repository.createQueryBuilder('despacho');

    if (query.pedidoId) {
      queryBuilder.andWhere('despacho.pedidoId = :pedidoId', {
        pedidoId: query.pedidoId,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Despacho | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<Despacho>,
  ): Promise<Despacho | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
