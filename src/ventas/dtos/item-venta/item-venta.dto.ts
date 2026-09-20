import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class ItemVentaDto {
  @IsUUID()
  productoExternoId: string;

  @IsOptional()
  @IsUUID()
  productoId?: string;

  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}
