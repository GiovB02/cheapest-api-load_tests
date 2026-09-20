export class RegistroVentaResponseDto {
  id!: string;
  tiendaId!: string;
  productoId!: string;
  ventaId!: string;
  itemInventarioId!: string;
  fechaVenta!: Date;
  cantidad!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
