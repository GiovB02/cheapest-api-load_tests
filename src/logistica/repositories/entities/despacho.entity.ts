import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('despachos')
export class Despacho {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  pedidoId: string;

  @Column('varchar', { length: 255 })
  bodega: string;

  @Column('timestamp')
  horaSalida: Date;

  @Column('timestamp')
  ventanaPrometidaInicio: Date;

  @Column('timestamp')
  ventanaPrometidaFin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Pedido, (pedido) => pedido.despachos)
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;
}
