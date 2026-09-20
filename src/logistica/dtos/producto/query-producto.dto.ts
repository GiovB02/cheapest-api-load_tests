import { IsOptional, IsString } from 'class-validator';

export class QueryProductoDto {
  @IsOptional()
  @IsString()
  codigoInterno?: string;

  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @IsOptional()
  @IsString()
  categoria?: string;
}
