import { arquivoRepository } from '../repositories/arquivo.repository';
import { CreateArquivoInput, UpdateArquivoInput } from '../models/arquivo.model';
import { AppError } from '../errors/app-error';

export const arquivoService = {
  list() {
    return arquivoRepository.findAll();
  },

  async getById(id: number) {
    const arquivo = await arquivoRepository.findById(id);
    if (!arquivo) throw new AppError('Arquivo não encontrado', 404);
    return arquivo;
  },

  create(input: CreateArquivoInput) {
    return arquivoRepository.create(input);
  },

  async update(id: number, input: UpdateArquivoInput) {
    await this.getById(id);
    return arquivoRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await arquivoRepository.delete(id);
  }
};