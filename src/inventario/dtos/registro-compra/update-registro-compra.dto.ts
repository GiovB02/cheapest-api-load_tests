import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateRegistroCompraDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaCompra?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidad?: number;
}
