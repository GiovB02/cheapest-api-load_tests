import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class QueryVentaDto {
  @IsOptional()
  @IsUUID()
  tiendaId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaDesde?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaHasta?: Date;

  @IsOptional()
  @IsUUID()
  productoExternoId?: string;

  @IsOptional()
  @IsUUID()
  productoId?: string;
}
