import { DataSource } from 'typeorm';
import { ItemVenta } from './entities/item-venta.entity';
import { ProductoExterno } from './entities/producto-externo.entity';
import { Venta } from './entities/venta.entity';

export const repositoryProviders = [
  {
    provide: 'PRODUCTO_EXTERNO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductoExterno),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VENTA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Venta),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ITEM_VENTA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ItemVenta),
    inject: ['DATA_SOURCE'],
  },
];
