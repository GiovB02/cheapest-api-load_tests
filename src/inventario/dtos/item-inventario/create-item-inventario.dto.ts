import { IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class CreateItemInventarioDto {
  @IsUUID()
  productoId: string;

  @IsUUID()
  tiendaId: string;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioVenta: number;

  @IsUUID()
  monedaId: string;
}
