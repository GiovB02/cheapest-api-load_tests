import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductoExterno } from './producto-externo.entity';
import { Venta } from './venta.entity';

@Entity('items_venta')
export class ItemVenta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ventaId: string;

  @Column('uuid', { nullable: true })
  productoExternoId: string | null;

  @Column('uuid', { nullable: true })
  productoId: string | null;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('uuid')
  monedaId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Venta, (venta) => venta.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ventaId' })
  venta: Venta;

  @ManyToOne(
    () => ProductoExterno,
    (productoExterno) => productoExterno.itemsVenta,
  )
  @JoinColumn({ name: 'productoExternoId' })
  productoExterno: ProductoExterno;
}
