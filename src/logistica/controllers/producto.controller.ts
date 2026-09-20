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
  CreateProductoDto,
  ProductoResponseDto,
  QueryProductoDto,
  UpdateProductoDto,
} from '../dtos';
import { ProductoService } from '../services';

@Controller('logistics/productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateProductoDto,
  ): Promise<ProductoResponseDto> {
    return this.productoService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryProductoDto,
  ): Promise<ProductoResponseDto[]> {
    return this.productoService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductoResponseDto> {
    return this.productoService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateProductoDto,
  ): Promise<ProductoResponseDto> {
    return this.productoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.productoService.delete(id);
  }
}
