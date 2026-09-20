import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCatalogoDto {
  @IsOptional()
  @IsDateString()
  vigenciaDesde?: Date;

  @IsOptional()
  @IsDateString()
  vigenciaHasta?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  zona?: string;
}
