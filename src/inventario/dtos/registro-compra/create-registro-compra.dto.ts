import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateRegistroCompraDto {
  @IsUUID()
  tiendaId!: string;

  @IsUUID()
  productoId!: string;

  @IsUUID()
  compraId!: string;

  @IsUUID()
  itemInventarioId!: string;

  @IsDate()
  @Type(() => Date)
  fechaCompra!: Date;

  @IsNumber()
  @IsPositive()
  cantidad!: number;
}
