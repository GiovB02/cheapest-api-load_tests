import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { EstadoPedido } from '../../repositories/entities';

export class UpdatePedidoDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  montoTotal?: number;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;
}
