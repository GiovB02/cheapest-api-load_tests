import { IsOptional, IsUUID } from 'class-validator';

export class QueryCatalogoDto {
  @IsOptional()
  @IsUUID()
  tiendaId?: string;
}
