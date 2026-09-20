import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateNotaCreditoDto,
  NotaCreditoResponseDto,
  QueryNotaCreditoDto,
  UpdateNotaCreditoDto,
} from '../dtos';
import { NotaCreditoRepository, PedidoRepository } from '../repositories';
import { NotaCredito } from '../repositories/entities';

@Injectable()
export class NotaCreditoService {
  constructor(
    private readonly notaCreditoRepository: NotaCreditoRepository,
    private readonly pedidoRepository: PedidoRepository,
  ) {}

  async create(dto: CreateNotaCreditoDto): Promise<NotaCreditoResponseDto> {
    // Validar que el pedido existe
    const pedido = await this.pedidoRepository.findById(dto.pedidoId);
    if (!pedido) {
      throw new BadRequestException(`Pedido con id ${dto.pedidoId} no existe`);
    }

    const notaCredito = await this.notaCreditoRepository.create(dto);
    return this.mapToResponse(notaCredito);
  }

  async findAll(query: QueryNotaCreditoDto): Promise<NotaCreditoResponseDto[]> {
    const notasCredito = await this.notaCreditoRepository.findAll(query);
    return notasCredito.map((notaCredito) => this.mapToResponse(notaCredito));
  }

  async findById(id: string): Promise<NotaCreditoResponseDto> {
    const notaCredito = await this.notaCreditoRepository.findById(id);
    if (!notaCredito) {
      throw new NotFoundException(`NotaCredito con id ${id} no encontrada`);
    }
    return this.mapToResponse(notaCredito);
  }

  async update(
    id: string,
    dto: UpdateNotaCreditoDto,
  ): Promise<NotaCreditoResponseDto> {
    const notaCredito = await this.notaCreditoRepository.findById(id);
    if (!notaCredito) {
      throw new NotFoundException(`NotaCredito con id ${id} no encontrada`);
    }

    const updatedNotaCredito = await this.notaCreditoRepository.update(id, dto);
    return this.mapToResponse(updatedNotaCredito!);
  }

  async delete(id: string): Promise<void> {
    const notaCredito = await this.notaCreditoRepository.findById(id);
    if (!notaCredito) {
      throw new NotFoundException(`NotaCredito con id ${id} no encontrada`);
    }

    await this.notaCreditoRepository.delete(id);
  }

  private mapToResponse(notaCredito: NotaCredito): NotaCreditoResponseDto {
    return {
      id: notaCredito.id,
      pedidoId: notaCredito.pedidoId,
      numeroDocumento: notaCredito.numeroDocumento,
      fecha: notaCredito.fecha,
      motivo: notaCredito.motivo,
      monto: notaCredito.monto,
      monedaId: notaCredito.monedaId,
      evidencia: notaCredito.evidencia,
      createdAt: notaCredito.createdAt,
      updatedAt: notaCredito.updatedAt,
    };
  }
}
