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
  CreateDisponibilidadZonaDto,
  DisponibilidadZonaResponseDto,
  QueryDisponibilidadZonaDto,
  UpdateDisponibilidadZonaDto,
} from '../dtos';
import { DisponibilidadZonaService } from '../services';

@Controller('logistics/disponibilidad-zona')
export class DisponibilidadZonaController {
  constructor(
    private readonly disponibilidadZonaService: DisponibilidadZonaService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateDisponibilidadZonaDto,
  ): Promise<DisponibilidadZonaResponseDto> {
    return this.disponibilidadZonaService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryDisponibilidadZonaDto,
  ): Promise<DisponibilidadZonaResponseDto[]> {
    return this.disponibilidadZonaService.findAll(query);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<DisponibilidadZonaResponseDto> {
    return this.disponibilidadZonaService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateDisponibilidadZonaDto,
  ): Promise<DisponibilidadZonaResponseDto> {
    return this.disponibilidadZonaService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.disponibilidadZonaService.delete(id);
  }
}
