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

export enum MotivoNotaCredito {
  PRODUCTO_VENCIDO = 'productoVencido',
  PRODUCTO_EQUIVOCADO = 'productoEquivocado',
  DANO_EN_TRANSPORTE = 'danoEnTransporte',
}

@Entity('notas_credito')
export class NotaCredito {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  pedidoId: string;

  @Column('varchar', { length: 100 })
  numeroDocumento: string;

  @Column('date')
  fecha: Date;

  @Column({
    type: 'enum',
    enum: MotivoNotaCredito,
  })
  motivo: MotivoNotaCredito;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column('uuid')
  monedaId: string;

  @Column('text', { nullable: true })
  evidencia: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Pedido, (pedido) => pedido.notasCredito)
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;
}
