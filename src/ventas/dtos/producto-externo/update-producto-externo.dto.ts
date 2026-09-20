import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateProductoExternoDto {
  @IsOptional()
  @IsUUID()
  tiendaId?: string;

  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precioBase?: number;

  @IsOptional()
  @IsUUID()
  monedaId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidad?: number;
}
