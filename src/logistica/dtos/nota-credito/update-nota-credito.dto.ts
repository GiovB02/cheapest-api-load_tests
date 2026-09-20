import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { MotivoNotaCredito } from '../../repositories/entities';

export class UpdateNotaCreditoDto {
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @IsOptional()
  @IsEnum(MotivoNotaCredito)
  motivo?: MotivoNotaCredito;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  monto?: number;

  @IsOptional()
  @IsString()
  evidencia?: string;
}
