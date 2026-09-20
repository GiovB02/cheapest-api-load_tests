import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateDisponibilidadZonaDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  cantidadDisponible?: number;
}
