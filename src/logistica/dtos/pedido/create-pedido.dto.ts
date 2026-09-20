import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { EstadoPedido } from '../../repositories/entities';

export class CreateItemPedidoDto {
  @IsUUID()
  productoId: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;

  @IsNumber()
  @Min(0)
  descuento: number;

  @IsUUID()
  monedaId: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fechaVencimiento?: string;
}

export class CreatePedidoDto {
  @IsString()
  @MaxLength(100)
  identificador: string;

  @IsUUID()
  tiendaId: string;

  @IsDateString()
  fechaHoraCreacion: Date;

  @IsNumber()
  @IsPositive()
  montoTotal: number;

  @IsUUID()
  monedaId: string;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  items: CreateItemPedidoDto[];
}
