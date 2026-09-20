import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../datasources/database.module';

// Clients
import { TiendaClientMock } from './clients';

// Repositories
import {
  CatalogoProductoRepository,
  CatalogoRepository,
  DespachoRepository,
  DisponibilidadZonaRepository,
  NotaCreditoRepository,
  PedidoRepository,
  ProductoRepository,
  PromocionRepository,
} from './repositories';

// Services
import {
  CatalogoProductoService,
  CatalogoService,
  DespachoService,
  DisponibilidadZonaService,
  NotaCreditoService,
  PedidoService,
  ProductoService,
  PromocionService,
  TenderoService,
} from './services';

// Controllers
import {
  CatalogoController,
  CatalogoProductoController,
  DespachoController,
  DisponibilidadZonaController,
  NotaCreditoController,
  PedidoController,
  ProductoController,
  PromocionController,
  TenderoController,
} from './controllers';

import { repositoryProviders } from './repositories/repository.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CatalogoController,
    ProductoController,
    PromocionController,
    PedidoController,
    DespachoController,
    NotaCreditoController,
    DisponibilidadZonaController,
    CatalogoProductoController,
    TenderoController,
  ],
  providers: [
    // Repository Providers
    ...repositoryProviders,
    // Clients
    TiendaClientMock,
    // Repositories
    CatalogoRepository,
    ProductoRepository,
    PromocionRepository,
    PedidoRepository,
    DespachoRepository,
    NotaCreditoRepository,
    DisponibilidadZonaRepository,
    CatalogoProductoRepository,
    // Services
    CatalogoService,
    ProductoService,
    PromocionService,
    PedidoService,
    DespachoService,
    NotaCreditoService,
    DisponibilidadZonaService,
    CatalogoProductoService,
    TenderoService,
    // Mock Clients
    TiendaClientMock,
  ],
  exports: [
    CatalogoService,
    ProductoService,
    PromocionService,
    PedidoService,
    DespachoService,
    NotaCreditoService,
    DisponibilidadZonaService,
    CatalogoProductoService,
    TenderoService,
  ],
})
export class LogisticaModule {}
