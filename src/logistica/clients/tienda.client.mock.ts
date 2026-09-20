import { Injectable } from '@nestjs/common';

@Injectable()
export class TiendaClientMock {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exists(_tiendaId: string): Promise<boolean> {
    // Mock implementation - always returns true for testing
    // In production, this would call the actual Tienda service/API
    await new Promise((resolve) => setTimeout(resolve, 10));
    return true;
  }

  async findById(tiendaId: string): Promise<any> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 10));
    return {
      id: tiendaId,
      nombreComercial: 'Tienda Mock',
      rut: '123456789',
    };
  }

  async findByIds(tiendaIds: string[]): Promise<any[]> {
    // Mock implementation for multiple tiendas
    await new Promise((resolve) => setTimeout(resolve, 10));
    return tiendaIds.map((id) => ({
      id,
      nombreComercial: `Tienda Mock ${id}`,
      rut: '123456789',
    }));
  }
}
