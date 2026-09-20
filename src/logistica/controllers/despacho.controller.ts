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
  CreateDespachoDto,
  DespachoResponseDto,
  QueryDespachoDto,
  UpdateDespachoDto,
} from '../dtos';
import { DespachoService } from '../services';

@Controller('logistics/despachos')
export class DespachoController {
  constructor(private readonly despachoService: DespachoService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateDespachoDto,
  ): Promise<DespachoResponseDto> {
    return this.despachoService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryDespachoDto,
  ): Promise<DespachoResponseDto[]> {
    return this.despachoService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<DespachoResponseDto> {
    return this.despachoService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateDespachoDto,
  ): Promise<DespachoResponseDto> {
    return this.despachoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.despachoService.delete(id);
  }
}
