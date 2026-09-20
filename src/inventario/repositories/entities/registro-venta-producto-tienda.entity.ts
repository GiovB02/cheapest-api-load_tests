import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemInventario } from './item-inventario.entity';

@Entity('registros_venta_producto_tienda')
export class RegistroVentaProductoTienda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tiendaId: string;

  @Column('uuid')
  productoId: string;

  @Column('uuid')
  ventaId: string;

  @Column('uuid')
  itemInventarioId: string;

  @Column('timestamp')
  fechaVenta: Date;

  @Column('int')
  cantidad: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ItemInventario, (item) => item.registrosVenta)
  @JoinColumn({ name: 'itemInventarioId' })
  itemInventario: ItemInventario;
}
