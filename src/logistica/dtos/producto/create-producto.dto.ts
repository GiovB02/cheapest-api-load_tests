import {
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MaxLength(100)
  codigoInterno: string;

  @IsString()
  @MaxLength(100)
  codigoBarras: string;

  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @MaxLength(100)
  marca: string;

  @IsString()
  @MaxLength(100)
  categoria: string;

  @IsString()
  @MaxLength(100)
  presentacion: string;

  @IsNumber()
  @IsPositive()
  precioBase: number;

  @IsUUID()
  monedaId: string;
}
