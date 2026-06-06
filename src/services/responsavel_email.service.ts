import { responsavelEmailRepository } from '../repositories/responsavel_email.repository';
import { CreateResponsavelEmailInput, UpdateResponsavelEmailInput } from '../models/responsavel_email.model';
import { AppError } from '../errors/app-error';

export const responsavelEmailService = {
  list() {
    return responsavelEmailRepository.findAll();
  },

  async getById(id: number) {
    const responsavelEmail = await responsavelEmailRepository.findById(id);
    if (!responsavelEmail) throw new AppError('Email do responsável não encontrado', 404);
    return responsavelEmail;
  },

  create(input: CreateResponsavelEmailInput) {
    return responsavelEmailRepository.create(input);
  },

  async update(id: number, input: UpdateResponsavelEmailInput) {
    await this.getById(id);
    return responsavelEmailRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await responsavelEmailRepository.delete(id);
  },
};