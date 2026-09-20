import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryProductoExternoDto {
  @IsOptional()
  @IsUUID()
  tiendaId?: string;

  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  nombre?: string;
}
