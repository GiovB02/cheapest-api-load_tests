import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AddProductoToCatalogoDto } from '../dtos';
import { CatalogoProductoService } from '../services';

@Controller('logistics/catalogos/:catalogoId/productos')
export class CatalogoProductoController {
  constructor(
    private readonly catalogoProductoService: CatalogoProductoService,
  ) {}

  @Post()
  async addProductoToCatalogo(
    @Param('catalogoId') catalogoId: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: AddProductoToCatalogoDto,
  ): Promise<{ message: string }> {
    await this.catalogoProductoService.addProductoToCatalogo(
      catalogoId,
      dto.productoId,
    );
    return { message: 'Producto agregado al catalogo exitosamente' };
  }

  @Get()
  async getProductosByCatalogo(
    @Param('catalogoId') catalogoId: string,
  ): Promise<any[]> {
    return this.catalogoProductoService.getProductosByCatalogo(catalogoId);
  }

  @Delete(':productoId')
  async removeProductoFromCatalogo(
    @Param('catalogoId') catalogoId: string,
    @Param('productoId') productoId: string,
  ): Promise<{ message: string }> {
    await this.catalogoProductoService.removeProductoFromCatalogo(
      catalogoId,
      productoId,
    );
    return { message: 'Producto removido del catalogo exitosamente' };
  }
}
