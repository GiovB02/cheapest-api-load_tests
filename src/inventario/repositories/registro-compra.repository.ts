import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryRegistroCompraDto } from '../dtos/registro-compra/query-registro-compra.dto';
import { RegistroCompraProductoTienda } from './entities/registro-compra-producto-tienda.entity';

@Injectable()
export class RegistroCompraRepository {
  constructor(
    @Inject('REGISTRO_COMPRA_PRODUCTO_TIENDA_REPOSITORY')
    private repository: Repository<RegistroCompraProductoTienda>,
  ) {}

  async create(
    registro: Partial<RegistroCompraProductoTienda>,
  ): Promise<RegistroCompraProductoTienda> {
    const newRegistro = this.repository.create(registro);
    return this.repository.save(newRegistro);
  }

  async findAll(
    query: QueryRegistroCompraDto,
  ): Promise<RegistroCompraProductoTienda[]> {
    const queryBuilder = this.repository.createQueryBuilder('registro');

    if (query.tiendaId) {
      queryBuilder.andWhere('registro.tiendaId = :tiendaId', {
        tiendaId: query.tiendaId,
      });
    }

    if (query.productoId) {
      queryBuilder.andWhere('registro.productoId = :productoId', {
        productoId: query.productoId,
      });
    }

    if (query.fechaDesde && query.fechaHasta) {
      queryBuilder.andWhere(
        'registro.fechaCompra BETWEEN :fechaDesde AND :fechaHasta',
        {
          fechaDesde: new Date(query.fechaDesde),
          fechaHasta: new Date(query.fechaHasta),
        },
      );
    } else if (query.fechaDesde) {
      queryBuilder.andWhere('registro.fechaCompra >= :fechaDesde', {
        fechaDesde: new Date(query.fechaDesde),
      });
    } else if (query.fechaHasta) {
      queryBuilder.andWhere('registro.fechaCompra <= :fechaHasta', {
        fechaHasta: new Date(query.fechaHasta),
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<RegistroCompraProductoTienda | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<RegistroCompraProductoTienda>,
  ): Promise<RegistroCompraProductoTienda | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
