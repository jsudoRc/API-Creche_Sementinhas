
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


    // Futuramente, podemos adicionar uma checagem aqui para ver se a turma_id informada existe
    // criado XD 
    const turma = await turmaRepository.findById(input.turma_id)
    if(!turma)throw new AppError('A turma informada não existe no sistema!',404);

    // 2. Verifica se o funcionário existe
    const funcionario = await funcionarioRepository.findById(input.funcionario_id);
    if (!funcionario) throw new AppError('O funcionário responsável pelo cadastro não existe.', 404);

    return alunoRepository.create(input);
  },

  async update(id: number, input: UpdateAlunoInput) {
    await this.getById(id); // Garante que o aluno existe

    // Se estiverem tentando trocar o aluno de turma, verifica se a turma nova existe
    if (input.turma_id) {
        const turma = await turmaRepository.findById(input.turma_id);
        if (!turma) throw new AppError('A nova turma informada não existe.', 404);
    }

    // Se estiverem alterando quem fez o cadastro
    if (input.funcionario_id) {
        const funcionario = await funcionarioRepository.findById(input.funcionario_id);
        if (!funcionario) throw new AppError('O funcionário informado não existe.', 404);
    }
    return alunoRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await alunoRepository.delete(id);
  },
};