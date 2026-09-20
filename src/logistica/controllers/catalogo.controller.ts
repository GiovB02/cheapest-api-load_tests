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
  CatalogoResponseDto,
  CreateCatalogoDto,
  QueryCatalogoDto,
  UpdateCatalogoDto,
} from '../dtos';
import { CatalogoService } from '../services';

@Controller('logistics/catalogos')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateCatalogoDto,
  ): Promise<CatalogoResponseDto> {
    return this.catalogoService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryCatalogoDto,
  ): Promise<CatalogoResponseDto[]> {
    return this.catalogoService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<CatalogoResponseDto> {
    return this.catalogoService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateCatalogoDto,
  ): Promise<CatalogoResponseDto> {
    return this.catalogoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.catalogoService.delete(id);
  }
}
