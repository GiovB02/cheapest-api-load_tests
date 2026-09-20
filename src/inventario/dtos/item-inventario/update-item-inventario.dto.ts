import { IsNumber, IsOptional, IsPositive, IsUUID, Min } from 'class-validator';

export class UpdateItemInventarioDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precioVenta?: number;

  @IsOptional()
  @IsUUID()
  monedaId?: string;
}
