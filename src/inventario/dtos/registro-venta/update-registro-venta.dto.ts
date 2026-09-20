import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateRegistroVentaDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaVenta?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidad?: number;
}
