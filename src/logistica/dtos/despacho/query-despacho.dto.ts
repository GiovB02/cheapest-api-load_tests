import { IsOptional, IsUUID } from 'class-validator';

export class QueryDespachoDto {
  @IsOptional()
  @IsUUID()
  pedidoId?: string;
}
