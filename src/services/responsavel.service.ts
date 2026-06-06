import { responsavelRepository } from '../repositories/responsavel.repository';
import { CreateResponsavelInput, UpdateResponsavelInput } from '../models/responsavel.model';
import { AppError } from '../errors/app-error';

export const responsavelService = {
  list() {
    return responsavelRepository.findAll();
  },

  async getById(id: number) {
    const responsavel = await responsavelRepository.findById(id);
    if (!responsavel) throw new AppError('Responsável não encontrado', 404);
    return responsavel;
  },

  create(input: CreateResponsavelInput) {
    return responsavelRepository.create(input);
  },

  async update(id: number, input: UpdateResponsavelInput) {
    await this.getById(id);
    return responsavelRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await responsavelRepository.delete(id);
  },
};