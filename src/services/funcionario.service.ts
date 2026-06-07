import { funcionarioRepository } from '../repositories/funcionario.repository';
import { CreateFuncionarioInput, UpdateFuncionarioInput } from '../models/funcionario.model';
import { AppError } from '../errors/app-error';

export const funcionarioService = {
  list() {
    return funcionarioRepository.findAll();
  },

  async getById(id: number) {
    const funcionario = await funcionarioRepository.findById(id);
    if (!funcionario) throw new AppError('Funcionário não encontrado', 404);
    return funcionario;
  },

  async create(input: CreateFuncionarioInput) {

     // 1. Pergunta ao banco se o e-mail já existe
     const emailJaExiste =await funcionarioRepository.findByEmail(input.email)

     // 2. Se existir, levanta o escudo (AppError 409)
    if (emailJaExiste) {
      throw new AppError('E-mail já cadastrado no sistema', 409);
    }

    // 3. Se não existir,seguimos com o cadastro 
    return funcionarioRepository.create(input);
  },

  async update(id: number, input: UpdateFuncionarioInput) {
    await this.getById(id);

// Se ele estiver tentando alterar o e-mail, precisamos checar se não vai dar conflito
    if (input.email) {
      const emailJaExiste = await funcionarioRepository.findByEmail(input.email);
      
      // Se achou alguém com esse e-mail E o ID for diferente do funcionário atual
      if (emailJaExiste && emailJaExiste.id !== id) {
        throw new AppError('Este e-mail já está sendo usado por outro funcionário', 409);
      }
    }
    return funcionarioRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await funcionarioRepository.delete(id);
  },
};