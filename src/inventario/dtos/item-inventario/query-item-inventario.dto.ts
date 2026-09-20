import { IsOptional, IsUUID } from 'class-validator';

export class QueryItemInventarioDto {
  @IsOptional()
  @IsUUID()
  tiendaId?: string;

  @IsOptional()
  @IsUUID()
  productoId?: string;
}
