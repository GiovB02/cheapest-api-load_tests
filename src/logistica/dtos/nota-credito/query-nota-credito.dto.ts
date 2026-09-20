import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { MotivoNotaCredito } from '../../repositories/entities';

export class QueryNotaCreditoDto {
  @IsOptional()
  @IsUUID()
  pedidoId?: string;

  @IsOptional()
  @IsEnum(MotivoNotaCredito)
  motivo?: MotivoNotaCredito;
}
