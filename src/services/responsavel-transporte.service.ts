import { responsavelTransporteRepository } from '../repositories/responsavel-transporte.repository';
import { CreateResponsavelTransporteInput, UpdateResponsavelTransporteInput } from '../models/responsavel-transporte.model';
import { AppError } from '../errors/app-error';

export const responsavelTransporteService = {
  list() { return responsavelTransporteRepository.findAll(); },
  async getById(id: number) {
    const resp = await responsavelTransporteRepository.findById(id);
    if (!resp) throw new AppError('Responsável pelo transporte não encontrado', 404);
    return resp;
  },
  create(input: CreateResponsavelTransporteInput) { return responsavelTransporteRepository.create(input); },
  async update(id: number, input: UpdateResponsavelTransporteInput) {
    await this.getById(id);
    return responsavelTransporteRepository.update(id, input);
  },
  async remove(id: number) {
    await this.getById(id);
    await responsavelTransporteRepository.delete(id);
  }
};