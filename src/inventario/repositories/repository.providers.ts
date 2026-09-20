import { DataSource } from 'typeorm';
import {
  ItemInventario,
  RegistroCompraProductoTienda,
  RegistroVentaProductoTienda,
} from './entities';

export const repositoryProviders = [
  {
    provide: 'ITEM_INVENTARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ItemInventario),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'REGISTRO_COMPRA_PRODUCTO_TIENDA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RegistroCompraProductoTienda),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'REGISTRO_VENTA_PRODUCTO_TIENDA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RegistroVentaProductoTienda),
    inject: ['DATA_SOURCE'],
  },
];
