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
  CreatePedidoDto,
  PedidoResponseDto,
  QueryPedidoDto,
  UpdatePedidoDto,
} from '../dtos';
import { PedidoService } from '../services';

@Controller('logistics/pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreatePedidoDto,
  ): Promise<PedidoResponseDto> {
    return this.pedidoService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryPedidoDto,
  ): Promise<PedidoResponseDto[]> {
    return this.pedidoService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PedidoResponseDto> {
    return this.pedidoService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdatePedidoDto,
  ): Promise<PedidoResponseDto> {
    return this.pedidoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.pedidoService.delete(id);
  }
}
