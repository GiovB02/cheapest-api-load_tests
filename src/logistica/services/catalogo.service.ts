import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TiendaClientMock } from '../clients';
import {
  CatalogoResponseDto,
  CreateCatalogoDto,
  QueryCatalogoDto,
  UpdateCatalogoDto,
} from '../dtos';
import { CatalogoRepository } from '../repositories';
import { Catalogo } from '../repositories/entities';

@Injectable()
export class CatalogoService {
  constructor(
    private readonly catalogoRepository: CatalogoRepository,
    private readonly tiendaClient: TiendaClientMock,
  ) {}

  async create(dto: CreateCatalogoDto): Promise<CatalogoResponseDto> {
    const tiendaExists = await this.tiendaClient.exists(dto.tiendaId);
    if (!tiendaExists) {
      throw new BadRequestException(`Tienda con id ${dto.tiendaId} no existe`);
    }

    const catalogo = await this.catalogoRepository.create(dto);
    return this.mapToResponse(catalogo);
  }

  async findAll(query: QueryCatalogoDto): Promise<CatalogoResponseDto[]> {
    const catalogos = await this.catalogoRepository.findAll(query);
    return catalogos.map((catalogo) => this.mapToResponse(catalogo));
  }

  async findById(id: string): Promise<CatalogoResponseDto> {
    const catalogo = await this.catalogoRepository.findById(id);
    if (!catalogo) {
      throw new NotFoundException(`Catalogo con id ${id} no encontrado`);
    }
    return this.mapToResponse(catalogo);
  }

  async update(
    id: string,
    dto: UpdateCatalogoDto,
  ): Promise<CatalogoResponseDto> {
    const catalogo = await this.catalogoRepository.findById(id);
    if (!catalogo) {
      throw new NotFoundException(`Catalogo con id ${id} no encontrado`);
    }

    const updatedCatalogo = await this.catalogoRepository.update(id, dto);
    return this.mapToResponse(updatedCatalogo!);
  }

  async delete(id: string): Promise<void> {
    const catalogo = await this.catalogoRepository.findById(id);
    if (!catalogo) {
      throw new NotFoundException(`Catalogo con id ${id} no encontrado`);
    }

    await this.catalogoRepository.delete(id);
  }

  private mapToResponse(catalogo: Catalogo): CatalogoResponseDto {
    return {
      id: catalogo.id,
      tiendaId: catalogo.tiendaId,
      vigenciaDesde: catalogo.vigenciaDesde,
      vigenciaHasta: catalogo.vigenciaHasta,
      zona: catalogo.zona,
      createdAt: catalogo.createdAt,
      updatedAt: catalogo.updatedAt,
    };
  }
}
