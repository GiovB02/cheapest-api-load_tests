import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Catalogo } from './catalogo.entity';
import { DisponibilidadZona } from './disponibilidad-zona.entity';
import { ItemPedido } from './item-pedido.entity';
import { Promocion } from './promocion.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  codigoInterno: string;

  @Column('varchar', { length: 100 })
  codigoBarras: string;

  @Column('varchar', { length: 255 })
  nombre: string;

  @Column('varchar', { length: 100 })
  marca: string;

  @Column('varchar', { length: 100 })
  categoria: string;

  @Column('varchar', { length: 100 })
  presentacion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioBase: number;

  @Column('uuid')
  monedaId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Catalogo, (catalogo) => catalogo.productos)
  catalogos: Catalogo[];

  @OneToMany(
    () => DisponibilidadZona,
    (disponibilidad) => disponibilidad.producto,
  )
  disponibilidades: DisponibilidadZona[];

  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.producto)
  itemsPedido: ItemPedido[];

  @OneToMany(() => Promocion, (promocion) => promocion.producto)
  promociones: Promocion[];
}
