import { IsUUID } from 'class-validator';

export class AddPromocionToCatalogoDto {
  @IsUUID()
  promocionId: string;
}
