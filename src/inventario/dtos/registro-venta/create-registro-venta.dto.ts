import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateRegistroVentaDto {
  @IsUUID()
  tiendaId!: string;

  @IsUUID()
  productoId!: string;

  @IsUUID()
  ventaId!: string;

  @IsUUID()
  itemInventarioId!: string;

  @IsDate()
  @Type(() => Date)
  fechaVenta!: Date;

  @IsNumber()
  @IsPositive()
  cantidad!: number;
}
