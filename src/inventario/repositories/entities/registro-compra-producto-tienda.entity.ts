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

@Entity('registros_compra_producto_tienda')
export class RegistroCompraProductoTienda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tiendaId: string;

  @Column('uuid')
  productoId: string;

  @Column('uuid')
  compraId: string;

  @Column('uuid')
  itemInventarioId: string;

  @Column('timestamp')
  fechaCompra: Date;

  @Column('int')
  cantidad: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ItemInventario, (item) => item.registrosCompra)
  @JoinColumn({ name: 'itemInventarioId' })
  itemInventario: ItemInventario;
}
