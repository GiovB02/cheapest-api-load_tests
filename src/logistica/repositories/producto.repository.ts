import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryProductoDto } from '../dtos';
import { Producto } from './entities';

@Injectable()
export class ProductoRepository {
  constructor(
    @Inject('PRODUCTO_REPOSITORY')
    private repository: Repository<Producto>,
  ) {}

  async create(producto: Partial<Producto>): Promise<Producto> {
    const newProducto = this.repository.create(producto);
    return this.repository.save(newProducto);
  }

  async findAll(query: QueryProductoDto): Promise<Producto[]> {
    const queryBuilder = this.repository.createQueryBuilder('producto');

    if (query.codigoInterno) {
      queryBuilder.andWhere('producto.codigoInterno = :codigoInterno', {
        codigoInterno: query.codigoInterno,
      });
    }

    if (query.codigoBarras) {
      queryBuilder.andWhere('producto.codigoBarras = :codigoBarras', {
        codigoBarras: query.codigoBarras,
      });
    }

    if (query.categoria) {
      queryBuilder.andWhere('producto.categoria = :categoria', {
        categoria: query.categoria,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Producto | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<Producto>,
  ): Promise<Producto | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * HU 1 — Retorna los productos que:
   *   A) la tienda haya pedido alguna vez,
   *   B) estén actualmente en promoción para esa tienda, y
   *   C) tengan disponibilidad > 0 en el catálogo de la zona indicada.
   */
  async findProductosDisponiblesParaTendero(
    tiendaId: string,
    zona: string,
  ): Promise<Producto[]> {
    const now = new Date();
    return this.repository
      .createQueryBuilder('producto')
      .where(
        // A: alguna vez pedido por esta tienda
        `EXISTS (
          SELECT 1
          FROM items_pedido ip
          JOIN pedidos p ON p.id = ip."pedidoId"
          WHERE ip."productoId" = producto.id
            AND p."tiendaId" = :tiendaId
        )`,
        { tiendaId },
      )
      .andWhere(
        // B: en promoción activa para esta tienda
        `EXISTS (
          SELECT 1
          FROM promociones promo
          JOIN promocion_tiendas pt ON pt."promocionId" = promo.id
          WHERE promo."productoId" = producto.id
            AND promo.inicio <= :now
            AND promo.fin >= :now
            AND pt."tiendaId" = :tiendaId
        )`,
        { now, tiendaId },
      )
      .andWhere(
        // C: disponible en catálogo de la zona solicitada
        `EXISTS (
          SELECT 1
          FROM disponibilidad_zona dz
          JOIN catalogos cat ON cat.id = dz."catalogoId"
          WHERE dz."productoId" = producto.id
            AND dz."cantidadDisponible" > 0
            AND cat.zona = :zona
        )`,
        { zona },
      )
      .getMany();
  }
}
