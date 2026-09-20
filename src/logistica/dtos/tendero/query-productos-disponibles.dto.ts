import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class QueryProductosDisponiblesDto {
  @IsUUID()
  @IsNotEmpty()
  tiendaId: string;

  @IsString()
  @IsNotEmpty()
  zona: string;
}
