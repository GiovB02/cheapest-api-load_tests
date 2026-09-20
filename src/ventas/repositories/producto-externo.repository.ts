import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductoExterno } from './entities/producto-externo.entity';

export interface QueryProductoExternoDto {
  tiendaId?: string;
  codigoBarras?: string;
  categoria?: string;
  nombre?: string;
}

@Injectable()
export class ProductoExternoRepository {
  constructor(
    @Inject('PRODUCTO_EXTERNO_REPOSITORY')
    private repository: Repository<ProductoExterno>,
  ) {}

  async create(data: Partial<ProductoExterno>): Promise<ProductoExterno> {
    const productoExterno = this.repository.create(data);
    return this.repository.save(productoExterno);
  }

  async findAll(query: QueryProductoExternoDto): Promise<ProductoExterno[]> {
    const queryBuilder = this.repository.createQueryBuilder('productoExterno');

    if (query.tiendaId) {
      queryBuilder.andWhere('productoExterno.tiendaId = :tiendaId', {
        tiendaId: query.tiendaId,
      });
    }

    if (query.codigoBarras) {
      queryBuilder.andWhere('productoExterno.codigoBarras = :codigoBarras', {
        codigoBarras: query.codigoBarras,
      });
    }

    if (query.categoria) {
      queryBuilder.andWhere('productoExterno.categoria = :categoria', {
        categoria: query.categoria,
      });
    }

    if (query.nombre) {
      queryBuilder.andWhere('productoExterno.nombre LIKE :nombre', {
        nombre: `%${query.nombre}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<ProductoExterno | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<ProductoExterno>,
  ): Promise<ProductoExterno | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
