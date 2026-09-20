import { Injectable } from '@nestjs/common';

export interface Tienda {
  id: string;
  nombre: string;
  direccion: string;
}

@Injectable()
export class TiendaClientMock {
  private tiendas: Map<string, Tienda> = new Map([
    [
      '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
      {
        id: '9a2f2e7b-40c4-4c5f-a37c-baf722e18ab9',
        nombre: 'Tienda Central',
        direccion: 'Calle Principal 123',
      },
    ],
    [
      '9a2f2e7b-40c4-4c5f-a37c-baf722e18aba',
      {
        id: '9a2f2e7b-40c4-4c5f-a37c-baf722e18aba',
        nombre: 'Tienda Norte',
        direccion: 'Avenida Norte 456',
      },
    ],
    [
      '9a2f2e7b-40c4-4c5f-a37c-baf722e18abb',
      {
        id: '9a2f2e7b-40c4-4c5f-a37c-baf722e18abb',
        nombre: 'Tienda Sur',
        direccion: 'Boulevard Sur 789',
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
