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
  CreateItemInventarioDto,
  ItemInventarioResponseDto,
  QueryItemInventarioDto,
  UpdateItemInventarioDto,
} from '../dtos';
import { ItemInventarioService } from '../services';

@Controller('inventory/items')
export class ItemInventarioController {
  constructor(private readonly itemService: ItemInventarioService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateItemInventarioDto,
  ): Promise<ItemInventarioResponseDto> {
    return this.itemService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryItemInventarioDto,
  ): Promise<ItemInventarioResponseDto[]> {
    return this.itemService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemInventarioResponseDto> {
    return this.itemService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateItemInventarioDto,
  ): Promise<ItemInventarioResponseDto> {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.itemService.delete(id);
  }
}
