import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Catalogo } from './catalogo.entity';
import { Producto } from './producto.entity';

@Entity('disponibilidad_zona')
export class DisponibilidadZona {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  catalogoId: string;

  @Column('uuid')
  productoId: string;

  @Column('int')
  cantidadDisponible: number;

  @Column('timestamp')
  ultimaActualizacion: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Catalogo)
  @JoinColumn({ name: 'catalogoId' })
  catalogo: Catalogo;

  @ManyToOne(() => Producto, (producto) => producto.disponibilidades)
  @JoinColumn({ name: 'productoId' })
  producto: Producto;
}
