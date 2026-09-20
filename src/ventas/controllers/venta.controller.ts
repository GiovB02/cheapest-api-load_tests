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
  CreateVentaDto,
  QueryVentaDto,
  UpdateVentaDto,
  VentaResponseDto,
} from '../dtos';
import { VentaService } from '../services';

@Controller('ventas/ventas')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateVentaDto,
  ): Promise<VentaResponseDto> {
    return this.ventaService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryVentaDto,
  ): Promise<VentaResponseDto[]> {
    return this.ventaService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<VentaResponseDto> {
    return this.ventaService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateVentaDto,
  ): Promise<VentaResponseDto> {
    return this.ventaService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.ventaService.delete(id);
  }
}
