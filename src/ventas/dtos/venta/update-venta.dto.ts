import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { ItemVentaDto } from '../item-venta';

export class UpdateVentaDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaHora?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  items?: ItemVentaDto[];
}
