import { Injectable } from '@nestjs/common';

export interface Tienda {
  id: string;
  nombre: string;
  codigoInterno: string;
}

@Injectable()
export class TiendaClientMock {
  private tiendas: Map<string, Tienda> = new Map([
    [
      '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
      {
        id: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
        nombre: 'Tienda Central',
        codigoInterno: 'TC001',
      },
    ],
    [
      '9a2f2e7b-40c4-4c5f-a37c-baf722e18aba',
      {
        id: '9a2f2e7b-40c4-4c5f-a37c-baf722e18aba',
        nombre: 'Tienda Norte',
        codigoInterno: 'TN002',
      },
    ],
    [
      '9a2f2e7b-40c4-4c5f-a37c-baf722e18abb',
      {
        id: '9a2f2e7b-40c4-4c5f-a37c-baf722e18abb',
        nombre: 'Tienda Sur',
        codigoInterno: 'TS003',
      },
    ],
  ]);

  async findById(id: string): Promise<Tienda | null> {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simula latencia
    return this.tiendas.get(id) || null;
  }

  async exists(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simula latencia
    return this.tiendas.has(id);
  }
}
