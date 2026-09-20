import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ItemVentaDto } from '../item-venta';

export class CreateVentaDto {
  @IsUUID()
  tiendaId: string;

  @IsDate()
  @Type(() => Date)
  fechaHora: Date;

  @IsUUID()
  monedaId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ItemVentaDto)
  items: ItemVentaDto[];
}
