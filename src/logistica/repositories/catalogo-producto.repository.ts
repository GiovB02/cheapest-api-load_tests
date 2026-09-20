import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Catalogo, Producto } from './entities';

@Injectable()
export class CatalogoProductoRepository {
  constructor(
    @Inject('CATALOGO_REPOSITORY')
    private catalogoRepository: Repository<Catalogo>,
  ) {}

  async addProductoToCatalogo(
    catalogoId: string,
    productoId: string,
  ): Promise<void> {
    await this.catalogoRepository.manager
      .createQueryBuilder()
      .relation(Catalogo, 'productos')
      .of(catalogoId)
      .add(productoId);
  }

  async findByCatalogoId(catalogoId: string): Promise<Producto[]> {
    const catalogo = await this.catalogoRepository.findOne({
      where: { id: catalogoId },
      relations: ['productos'],
    });
    return catalogo?.productos ?? [];
  }

  async removeProductoFromCatalogo(
    catalogoId: string,
    productoId: string,
  ): Promise<void> {
    await this.catalogoRepository.manager
      .createQueryBuilder()
      .relation(Catalogo, 'productos')
      .of(catalogoId)
      .remove(productoId);
  }

  async exists(catalogoId: string, productoId: string): Promise<boolean> {
    const count = await this.catalogoRepository
      .createQueryBuilder('catalogo')
      .innerJoin('catalogo.productos', 'producto')
      .where('catalogo.id = :catalogoId', { catalogoId })
      .andWhere('producto.id = :productoId', { productoId })
      .getCount();
    return count > 0;
  }
}
