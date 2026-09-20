export class ItemVentaResponseDto {
  id: string;
  ventaId: string;
  productoExternoId?: string;
  productoId?: string;
  cantidad: number;
  precioUnitario: number;
  monedaId: string;
  createdAt: Date;
  updatedAt: Date;
}
