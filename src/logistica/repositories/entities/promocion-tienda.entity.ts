import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Promocion } from './promocion.entity';

@Entity('promocion_tiendas')
@Index(['promocionId', 'tiendaId'], { unique: true })
export class PromocionTienda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  promocionId: string;

  @Column('uuid')
  tiendaId: string;

  @ManyToOne(() => Promocion, (promocion) => promocion.tiendas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'promocionId' })
  promocion: Promocion;
}
