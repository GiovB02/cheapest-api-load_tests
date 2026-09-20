import { IsOptional, IsUUID } from 'class-validator';

export class QueryDisponibilidadZonaDto {
  @IsOptional()
  @IsUUID()
  catalogoId?: string;

  @IsOptional()
  @IsUUID()
  productoId?: string;
}
