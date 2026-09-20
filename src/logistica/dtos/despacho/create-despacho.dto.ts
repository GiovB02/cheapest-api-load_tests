import { IsDateString, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateDespachoDto {
  @IsUUID()
  pedidoId: string;

  @IsString()
  @MaxLength(255)
  bodega: string;

  @IsDateString()
  horaSalida: Date;

  @IsDateString()
  ventanaPrometidaInicio: Date;

  @IsDateString()
  ventanaPrometidaFin: Date;
}
