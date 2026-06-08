import fs from 'fs';
import { turmaRepository } from '../repositories/turma.repository';
import { alunoRepository } from '../repositories/aluno.repository';
import { funcionarioRepository } from '../repositories/funcionario.repository';
import { CreateAlunoInput, UpdateAlunoInput } from '../models/aluno.model';
import { AppError } from '../errors/app-error';

export const alunoService = {
  list() {
    return alunoRepository.findAll();
  },

  async getById(id: number) {
    const aluno = await alunoRepository.findById(id);
    if (!aluno) throw new AppError('Aluno não encontrado na base de dados.', 404);
    return aluno;
  },

  async create(input: CreateAlunoInput) {
    const turma = await turmaRepository.findById(input.turma_id);
    if (!turma) throw new AppError('A turma informada não existe no sistema!', 404);

    const funcionario = await funcionarioRepository.findById(input.funcionario_id);
    if (!funcionario) throw new AppError('O funcionário responsável pelo cadastro não existe.', 404);

    return alunoRepository.create(input);
  },

  async update(id: number, input: UpdateAlunoInput) {
    await this.getById(id);

    if (input.turma_id) {
      const turma = await turmaRepository.findById(input.turma_id);
      if (!turma) throw new AppError('A nova turma informada não existe.', 404);
    }

    if (input.funcionario_id) {
      const funcionario = await funcionarioRepository.findById(input.funcionario_id);
      if (!funcionario) throw new AppError('O funcionário informado não existe.', 404);
    }

    return alunoRepository.update(id, input);
  },

  async remove(id: number) {
    const aluno = await this.getById(id);

    // Deleta os arquivos físicos se existirem
    if (aluno.autorizacao_img) fs.unlink(aluno.autorizacao_img, () => {});
    if (aluno.receita_antitermico) fs.unlink(aluno.receita_antitermico, () => {});
    if (aluno.foto) fs.unlink(aluno.foto, () => {});

    await alunoRepository.delete(id);
  },
};