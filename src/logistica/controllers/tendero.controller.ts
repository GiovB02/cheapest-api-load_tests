import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ProductoResponseDto, QueryProductosDisponiblesDto } from '../dtos';
import { TenderoService } from '../services';

@Controller('/logistics/tenderos')
export class TenderoController {
  constructor(private readonly tenderoService: TenderoService) {}
  @Get('productos-disponibles')
  async getProductosDisponibles(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryProductosDisponiblesDto,
  ): Promise<ProductoResponseDto[]> {
    return await this.tenderoService.getProductosDisponibles(query);
  }
}
