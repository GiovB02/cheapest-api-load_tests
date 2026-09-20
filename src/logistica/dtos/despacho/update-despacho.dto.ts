import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDespachoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bodega?: string;

  @IsOptional()
  @IsDateString()
  horaSalida?: Date;

  @IsOptional()
  @IsDateString()
  ventanaPrometidaInicio?: Date;

  @IsOptional()
  @IsDateString()
  ventanaPrometidaFin?: Date;
}
