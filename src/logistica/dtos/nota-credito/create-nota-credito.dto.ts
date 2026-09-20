import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { MotivoNotaCredito } from '../../repositories/entities';

export class CreateNotaCreditoDto {
  @IsUUID()
  pedidoId: string;

  @IsString()
  @MaxLength(100)
  numeroDocumento: string;

  @IsDateString()
  fecha: Date;

  @IsEnum(MotivoNotaCredito)
  motivo: MotivoNotaCredito;

  @IsNumber()
  @IsPositive()
  monto: number;

  @IsUUID()
  monedaId: string;

  @IsOptional()
  @IsString()
  evidencia?: string;
}
