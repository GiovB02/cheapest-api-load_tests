import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from './producto.entity';
import { PromocionTienda } from './promocion-tienda.entity';

@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precioPromocional: number;

  @Column('uuid')
  monedaId: string;

  @Column('uuid')
  productoId: string;

  @Column('timestamp')
  inicio: Date;

  @Column('timestamp')
  fin: Date;

  @Column('int')
  restricciones: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Producto, (producto) => producto.promociones)
  @JoinColumn({ name: 'productoId' })
  producto: Producto;

  @OneToMany(() => PromocionTienda, (promocionTienda) => promocionTienda.promocion, {
    cascade: true,
    eager: true,
  })
  tiendas: PromocionTienda[];
}
