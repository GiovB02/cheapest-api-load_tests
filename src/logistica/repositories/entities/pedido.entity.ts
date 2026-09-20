import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Despacho } from './despacho.entity';
import { ItemPedido } from './item-pedido.entity';
import { NotaCredito } from './nota-credito.entity';

export enum EstadoPedido {
  CREADO = 'creado',
  APROBADO = 'aprobado',
  EN_ALISTAMIENTO = 'enAlistamiento',
  ALISTADO = 'alistado',
  DESPACHADO = 'despachado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
  DEVUELTO = 'devuelto',
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  identificador: string;

  @Column('uuid')
  tiendaId: string;

  @Column('timestamp')
  fechaHoraCreacion: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  montoTotal: number;

  @Column('uuid')
  monedaId: string;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.CREADO,
  })
  estado: EstadoPedido;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.pedido, {
    cascade: true,
  })
  items: ItemPedido[];

  @OneToMany(() => Despacho, (despacho) => despacho.pedido)
  despachos: Despacho[];

  @OneToMany(() => NotaCredito, (notaCredito) => notaCredito.pedido)
  notasCredito: NotaCredito[];
}
