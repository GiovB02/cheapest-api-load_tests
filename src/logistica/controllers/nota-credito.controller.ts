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
  CreateNotaCreditoDto,
  NotaCreditoResponseDto,
  QueryNotaCreditoDto,
  UpdateNotaCreditoDto,
} from '../dtos';
import { NotaCreditoService } from '../services';

@Controller('logistics/notas-credito')
export class NotaCreditoController {
  constructor(private readonly notaCreditoService: NotaCreditoService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateNotaCreditoDto,
  ): Promise<NotaCreditoResponseDto> {
    return this.notaCreditoService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryNotaCreditoDto,
  ): Promise<NotaCreditoResponseDto[]> {
    return this.notaCreditoService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<NotaCreditoResponseDto> {
    return this.notaCreditoService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateNotaCreditoDto,
  ): Promise<NotaCreditoResponseDto> {
    return this.notaCreditoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.notaCreditoService.delete(id);
  }
}
