import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryNotaCreditoDto } from '../dtos';
import { NotaCredito } from './entities';

@Injectable()
export class NotaCreditoRepository {
  constructor(
    @Inject('NOTA_CREDITO_REPOSITORY')
    private repository: Repository<NotaCredito>,
  ) {}

  async create(notaCredito: Partial<NotaCredito>): Promise<NotaCredito> {
    const newNotaCredito = this.repository.create(notaCredito);
    return this.repository.save(newNotaCredito);
  }

  async findAll(query: QueryNotaCreditoDto): Promise<NotaCredito[]> {
    const queryBuilder = this.repository.createQueryBuilder('notaCredito');

    if (query.pedidoId) {
      queryBuilder.andWhere('notaCredito.pedidoId = :pedidoId', {
        pedidoId: query.pedidoId,
      });
    }

    if (query.motivo) {
      queryBuilder.andWhere('notaCredito.motivo = :motivo', {
        motivo: query.motivo,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<NotaCredito | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<NotaCredito>,
  ): Promise<NotaCredito | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
