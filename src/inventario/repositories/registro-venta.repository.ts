import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryRegistroVentaDto } from '../dtos/registro-venta/query-registro-venta.dto';
import { RegistroVentaProductoTienda } from './entities/registro-venta-producto-tienda.entity';

@Injectable()
export class RegistroVentaRepository {
  constructor(
    @Inject('REGISTRO_VENTA_PRODUCTO_TIENDA_REPOSITORY')
    private repository: Repository<RegistroVentaProductoTienda>,
  ) {}

  async create(
    registro: Partial<RegistroVentaProductoTienda>,
  ): Promise<RegistroVentaProductoTienda> {
    const newRegistro = this.repository.create(registro);
    return this.repository.save(newRegistro);
  }

  async findAll(
    query: QueryRegistroVentaDto,
  ): Promise<RegistroVentaProductoTienda[]> {
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
        'registro.fechaVenta BETWEEN :fechaDesde AND :fechaHasta',
        {
          fechaDesde: new Date(query.fechaDesde),
          fechaHasta: new Date(query.fechaHasta),
        },
      );
    } else if (query.fechaDesde) {
      queryBuilder.andWhere('registro.fechaVenta >= :fechaDesde', {
        fechaDesde: new Date(query.fechaDesde),
      });
    } else if (query.fechaHasta) {
      queryBuilder.andWhere('registro.fechaVenta <= :fechaHasta', {
        fechaHasta: new Date(query.fechaHasta),
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<RegistroVentaProductoTienda | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<RegistroVentaProductoTienda>,
  ): Promise<RegistroVentaProductoTienda | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
