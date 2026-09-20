export class PromocionResponseDto {
  id: string;
  nombre: string;
  precioPromocional: number;
  monedaId: string;
  productoId: string;
  tiendaIds: string[];
  inicio: Date;
  fin: Date;
  restricciones: number;
  createdAt: Date;
  updatedAt: Date;
}
