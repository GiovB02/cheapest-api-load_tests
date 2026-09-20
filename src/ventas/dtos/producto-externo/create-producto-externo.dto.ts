import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductoExternoDto {
  @IsUUID()
  tiendaId: string;

  @IsString()
  @IsNotEmpty()
  codigoBarras: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsNumber()
  @IsPositive()
  precioBase: number;

  @IsUUID()
  monedaId: string;

  @IsNumber()
  @IsPositive()
  cantidad: number;
}
