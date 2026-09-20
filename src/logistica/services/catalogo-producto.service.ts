import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CatalogoProductoRepository,
  CatalogoRepository,
  ProductoRepository,
} from '../repositories';

@Injectable()
export class CatalogoProductoService {
  constructor(
    private readonly catalogoProductoRepository: CatalogoProductoRepository,
    private readonly catalogoRepository: CatalogoRepository,
    private readonly productoRepository: ProductoRepository,
  ) {}

  async addProductoToCatalogo(
    catalogoId: string,
    productoId: string,
  ): Promise<void> {
    // Validar que el catalogo existe
    const catalogo = await this.catalogoRepository.findById(catalogoId);
    if (!catalogo) {
      throw new NotFoundException(
        `Catalogo con id ${catalogoId} no encontrado`,
      );
    }

    // Validar que el producto existe
    const producto = await this.productoRepository.findById(productoId);
    if (!producto) {
      throw new NotFoundException(
        `Producto con id ${productoId} no encontrado`,
      );
    }

    // Validar que no existe ya la relación
    const exists = await this.catalogoProductoRepository.exists(
      catalogoId,
      productoId,
    );
    if (exists) {
      throw new BadRequestException(
        `El producto ${productoId} ya está en el catalogo ${catalogoId}`,
      );
    }

    await this.catalogoProductoRepository.addProductoToCatalogo(
      catalogoId,
      productoId,
    );
  }

  async removeProductoFromCatalogo(
    catalogoId: string,
    productoId: string,
  ): Promise<void> {
    const exists = await this.catalogoProductoRepository.exists(
      catalogoId,
      productoId,
    );
    if (!exists) {
      throw new NotFoundException(
        `El producto ${productoId} no está en el catalogo ${catalogoId}`,
      );
    }

    await this.catalogoProductoRepository.removeProductoFromCatalogo(
      catalogoId,
      productoId,
    );
  }

  async getProductosByCatalogo(catalogoId: string): Promise<any[]> {
    const catalogo = await this.catalogoRepository.findById(catalogoId);
    if (!catalogo) {
      throw new NotFoundException(
        `Catalogo con id ${catalogoId} no encontrado`,
      );
    }

    const relations =
      await this.catalogoProductoRepository.findByCatalogoId(catalogoId);
    return relations;
  }
}
