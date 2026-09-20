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
  CreateRegistroCompraDto,
  QueryRegistroCompraDto,
  RegistroCompraResponseDto,
  UpdateRegistroCompraDto,
} from '../dtos';
import { RegistroCompraService } from '../services/registro-compra.service';

@Controller('inventory/compras')
export class RegistroCompraController {
  constructor(private readonly registroService: RegistroCompraService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateRegistroCompraDto,
  ): Promise<RegistroCompraResponseDto> {
    return this.registroService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryRegistroCompraDto,
  ): Promise<RegistroCompraResponseDto[]> {
    return this.registroService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<RegistroCompraResponseDto> {
    return this.registroService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateRegistroCompraDto,
  ): Promise<RegistroCompraResponseDto> {
    return this.registroService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.registroService.delete(id);
  }
}
