import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDespachoDto,
  DespachoResponseDto,
  QueryDespachoDto,
  UpdateDespachoDto,
} from '../dtos';
import { DespachoRepository, PedidoRepository } from '../repositories';
import { Despacho } from '../repositories/entities';

@Injectable()
export class DespachoService {
  constructor(
    private readonly despachoRepository: DespachoRepository,
    private readonly pedidoRepository: PedidoRepository,
  ) {}

  async create(dto: CreateDespachoDto): Promise<DespachoResponseDto> {
    // Validar que el pedido existe
    const pedido = await this.pedidoRepository.findById(dto.pedidoId);
    if (!pedido) {
      throw new BadRequestException(`Pedido con id ${dto.pedidoId} no existe`);
    }

    const despacho = await this.despachoRepository.create(dto);
    return this.mapToResponse(despacho);
  }

  async findAll(query: QueryDespachoDto): Promise<DespachoResponseDto[]> {
    const despachos = await this.despachoRepository.findAll(query);
    return despachos.map((despacho) => this.mapToResponse(despacho));
  }

  async findById(id: string): Promise<DespachoResponseDto> {
    const despacho = await this.despachoRepository.findById(id);
    if (!despacho) {
      throw new NotFoundException(`Despacho con id ${id} no encontrado`);
    }
    return this.mapToResponse(despacho);
  }

  async update(
    id: string,
    dto: UpdateDespachoDto,
  ): Promise<DespachoResponseDto> {
    const despacho = await this.despachoRepository.findById(id);
    if (!despacho) {
      throw new NotFoundException(`Despacho con id ${id} no encontrado`);
    }

    const updatedDespacho = await this.despachoRepository.update(id, dto);
    return this.mapToResponse(updatedDespacho!);
  }

  async delete(id: string): Promise<void> {
    const despacho = await this.despachoRepository.findById(id);
    if (!despacho) {
      throw new NotFoundException(`Despacho con id ${id} no encontrado`);
    }

    await this.despachoRepository.delete(id);
  }

  private mapToResponse(despacho: Despacho): DespachoResponseDto {
    return {
      id: despacho.id,
      pedidoId: despacho.pedidoId,
      bodega: despacho.bodega,
      horaSalida: despacho.horaSalida,
      ventanaPrometidaInicio: despacho.ventanaPrometidaInicio,
      ventanaPrometidaFin: despacho.ventanaPrometidaFin,
      createdAt: despacho.createdAt,
      updatedAt: despacho.updatedAt,
    };
  }
}
