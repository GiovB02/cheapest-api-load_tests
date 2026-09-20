import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryItemInventarioDto } from '../dtos/item-inventario/query-item-inventario.dto';
import { ItemInventario } from './entities';

@Injectable()
export class ItemInventarioRepository {
  constructor(
    @Inject('ITEM_INVENTARIO_REPOSITORY')
    private repository: Repository<ItemInventario>,
  ) {}

  async create(item: Partial<ItemInventario>): Promise<ItemInventario> {
    const newItem = this.repository.create(item);
    return this.repository.save(newItem);
  }

  async findAll(query: QueryItemInventarioDto): Promise<ItemInventario[]> {
    const queryBuilder = this.repository.createQueryBuilder('item');

    if (query.tiendaId) {
      queryBuilder.andWhere('item.tiendaId = :tiendaId', {
        tiendaId: query.tiendaId,
      });
    }

    if (query.productoId) {
      queryBuilder.andWhere('item.productoId = :productoId', {
        productoId: query.productoId,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<ItemInventario | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByProductoAndTienda(
    productoId: string,
    tiendaId: string,
  ): Promise<ItemInventario | null> {
    return this.repository.findOne({ where: { productoId, tiendaId } });
  }

  async update(
    id: string,
    updates: Partial<ItemInventario>,
  ): Promise<ItemInventario | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async decrementCantidad(id: string, cantidad: number): Promise<void> {
    await this.repository.decrement({ id }, 'cantidad', cantidad);
  }

  async incrementCantidad(id: string, cantidad: number): Promise<void> {
    await this.repository.increment({ id }, 'cantidad', cantidad);
  }
}
