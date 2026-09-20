import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryPedidoDto } from '../dtos';
import { Pedido } from './entities';

@Injectable()
export class PedidoRepository {
  constructor(
    @Inject('PEDIDO_REPOSITORY')
    private repository: Repository<Pedido>,
  ) {}

  async create(pedido: Partial<Pedido>): Promise<Pedido> {
    const newPedido = this.repository.create(pedido);
    return this.repository.save(newPedido);
  }

  async findAll(query: QueryPedidoDto): Promise<Pedido[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.items', 'items');

    if (query.tiendaId) {
      queryBuilder.andWhere('pedido.tiendaId = :tiendaId', {
        tiendaId: query.tiendaId,
      });
    }

    if (query.estado) {
      queryBuilder.andWhere('pedido.estado = :estado', {
        estado: query.estado,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Pedido | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async update(id: string, updates: Partial<Pedido>): Promise<Pedido | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
