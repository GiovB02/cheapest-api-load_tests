import { IsOptional, IsString } from 'class-validator';

export class QueryPromocionDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}
