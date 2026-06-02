import { contatoEmergenciaRepository } from '../repositories/contato-emergencia.repository';
import { CreateContatoEmergenciaInput, UpdateContatoEmergenciaInput } from '../models/contato-emergencia.model';
import { AppError } from '../errors/app-error';

export const contatoEmergenciaService = {
  list() { return contatoEmergenciaRepository.findAll(); },
  async getById(id: number) {
    const contato = await contatoEmergenciaRepository.findById(id);
    if (!contato) throw new AppError('Contato de emergência não encontrado', 404);
    return contato;
  },
  create(input: CreateContatoEmergenciaInput) { return contatoEmergenciaRepository.create(input); },
  async update(id: number, input: UpdateContatoEmergenciaInput) {
    await this.getById(id);
    return contatoEmergenciaRepository.update(id, input);
  },
  async remove(id: number) {
    await this.getById(id);
    await contatoEmergenciaRepository.delete(id);
  }
};