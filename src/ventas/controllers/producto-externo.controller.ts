import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateProductoExternoDto,
  ProductoExternoResponseDto,
  QueryProductoExternoDto,
  UpdateProductoExternoDto,
} from '../dtos';
import { ProductoExternoService } from '../services';

@Controller('ventas/productos-externos')
export class ProductoExternoController {
  constructor(
    private readonly productoExternoService: ProductoExternoService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateProductoExternoDto,
  ): Promise<ProductoExternoResponseDto> {
    return this.productoExternoService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryProductoExternoDto,
  ): Promise<ProductoExternoResponseDto[]> {
    return this.productoExternoService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductoExternoResponseDto> {
    return this.productoExternoService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateProductoExternoDto,
  ): Promise<ProductoExternoResponseDto> {
    return this.productoExternoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.productoExternoService.delete(id);
  }
}
