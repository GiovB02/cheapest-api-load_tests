import { IsUUID } from 'class-validator';

export class AddProductoToCatalogoDto {
  @IsUUID()
  productoId: string;
}
