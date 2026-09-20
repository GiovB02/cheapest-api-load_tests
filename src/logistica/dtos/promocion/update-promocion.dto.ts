import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdatePromocionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombre?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precioPromocional?: number;

  @IsOptional()
  @IsDateString()
  inicio?: Date;

  @IsOptional()
  @IsDateString()
  fin?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  restricciones?: number;
}
