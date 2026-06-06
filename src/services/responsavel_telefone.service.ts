import { responsavelTelefoneRepository } from '../repositories/responsavel_telefone.repository';
import { CreateResponsavelTelefoneInput, UpdateResponsavelTelefoneInput } from '../models/responsavel_telefone.model';
import { AppError } from '../errors/app-error';

export const responsavelTelefoneService = {
  list() {
    return responsavelTelefoneRepository.findAll();
  },

  async getById(id: number) {
    const responsavelTelefone = await responsavelTelefoneRepository.findById(id);
    if (!responsavelTelefone) throw new AppError('Telefone do responsável não encontrado', 404);
    return responsavelTelefone;
  },

  create(input: CreateResponsavelTelefoneInput) {
    return responsavelTelefoneRepository.create(input);
  },

  async update(id: number, input: UpdateResponsavelTelefoneInput) {
    await this.getById(id);
    return responsavelTelefoneRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await responsavelTelefoneRepository.delete(id);
  },
};