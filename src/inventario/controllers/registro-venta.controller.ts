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
  CreateRegistroVentaDto,
  QueryRegistroVentaDto,
  RegistroVentaResponseDto,
  UpdateRegistroVentaDto,
} from '../dtos';
import { RegistroVentaService } from '../services/registro-venta.service';

@Controller('inventory/ventas')
export class RegistroVentaController {
  constructor(private readonly registroService: RegistroVentaService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateRegistroVentaDto,
  ): Promise<RegistroVentaResponseDto> {
    return this.registroService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryRegistroVentaDto,
  ): Promise<RegistroVentaResponseDto[]> {
    return this.registroService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<RegistroVentaResponseDto> {
    return this.registroService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateRegistroVentaDto,
  ): Promise<RegistroVentaResponseDto> {
    return this.registroService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.registroService.delete(id);
  }
}
