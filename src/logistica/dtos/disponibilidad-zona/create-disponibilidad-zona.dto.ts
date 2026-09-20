import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateDisponibilidadZonaDto {
  @IsUUID()
  catalogoId: string;

  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(0)
  cantidadDisponible: number;
}
