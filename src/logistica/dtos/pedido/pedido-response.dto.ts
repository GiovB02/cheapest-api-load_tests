import { EstadoPedido } from '../../repositories/entities';

export class ItemPedidoResponseDto {
  id: string;
  pedidoId: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  monedaId: string;
  lote?: string;
  fechaVencimiento?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PedidoResponseDto {
  id: string;
  identificador: string;
  tiendaId: string;
  fechaHoraCreacion: Date;
  montoTotal: number;
  monedaId: string;
  estado: EstadoPedido;
  items?: ItemPedidoResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
