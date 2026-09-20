export class RegistroCompraResponseDto {
  id!: string;
  tiendaId!: string;
  productoId!: string;
  compraId!: string;
  itemInventarioId!: string;
  fechaCompra!: Date;
  cantidad!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
