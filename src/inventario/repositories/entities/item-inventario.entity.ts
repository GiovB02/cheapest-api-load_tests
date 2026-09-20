import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegistroCompraProductoTienda } from './registro-compra-producto-tienda.entity';
import { RegistroVentaProductoTienda } from './registro-venta-producto-tienda.entity';

@Entity('items_inventario')
export class ItemInventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  productoId: string;

  @Column('uuid')
  tiendaId: string;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioVenta: number;

  @Column('uuid')
  monedaId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => RegistroVentaProductoTienda,
    (registro) => registro.itemInventario,
  )
  registrosVenta: RegistroVentaProductoTienda[];

  @OneToMany(
    () => RegistroCompraProductoTienda,
    (registro) => registro.itemInventario,
  )
  registrosCompra: RegistroCompraProductoTienda[];
}
