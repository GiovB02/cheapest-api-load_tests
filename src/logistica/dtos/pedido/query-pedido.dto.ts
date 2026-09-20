import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { EstadoPedido } from '../../repositories/entities';

export class QueryPedidoDto {
  @IsOptional()
  @IsUUID()
  tiendaId?: string;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;
}
