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
  CreatePromocionDto,
  PromocionResponseDto,
  QueryPromocionDto,
  UpdatePromocionDto,
} from '../dtos';
import { PromocionService } from '../services';

@Controller('logistics/promociones')
export class PromocionController {
  constructor(private readonly promocionService: PromocionService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreatePromocionDto,
  ): Promise<PromocionResponseDto> {
    return this.promocionService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryPromocionDto,
  ): Promise<PromocionResponseDto[]> {
    return this.promocionService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PromocionResponseDto> {
    return this.promocionService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdatePromocionDto,
  ): Promise<PromocionResponseDto> {
    return this.promocionService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.promocionService.delete(id);
  }
}
