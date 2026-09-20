import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemVenta } from './item-venta.entity';

@Entity('productos_externos')
export class ProductoExterno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tiendaId: string;

  @Column('varchar', { length: 255 })
  codigoBarras: string;

  @Column('varchar', { length: 255 })
  nombre: string;

  @Column('varchar', { length: 100 })
  categoria: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioBase: number;

  @Column('uuid')
  monedaId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cantidad: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ItemVenta, (itemVenta) => itemVenta.productoExterno)
  itemsVenta: ItemVenta[];
}
