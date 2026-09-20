import { DataSource } from 'typeorm';
import {
  Catalogo,
  Despacho,
  DisponibilidadZona,
  NotaCredito,
  Pedido,
  Producto,
  Promocion,
} from './entities';

export const repositoryProviders = [
  {
    provide: 'CATALOGO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Catalogo),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PRODUCTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Producto),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PROMOCION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Promocion),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PEDIDO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Pedido),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DESPACHO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Despacho),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'NOTA_CREDITO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NotaCredito),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DISPONIBILIDAD_ZONA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DisponibilidadZona),
    inject: ['DATA_SOURCE'],
  },
];
