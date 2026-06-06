import { matriculaRepository } from '../repositories/matricula.repository';
import { CreateMatriculaInput, UpdateMatriculaInput } from '../models/matricula.model';
import { AppError } from '../errors/app-error';

export const matriculaService = {
  list() {
    return matriculaRepository.findAll();
  },

  async getById(id: number) {
    const matricula = await matriculaRepository.findById(id);
    if (!matricula) throw new AppError('Matrícula não encontrada', 404);
    return matricula;
  },

  create(input: CreateMatriculaInput) {
    return matriculaRepository.create(input);
  },

  async update(id: number, input: UpdateMatriculaInput) {
    await this.getById(id);
    return matriculaRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await matriculaRepository.delete(id);
  },
};