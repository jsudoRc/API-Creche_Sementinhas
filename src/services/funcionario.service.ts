import { funcionarioRepository } from '../repositories/funcionario.repository';
import { CreateFuncionarioInput, UpdateFuncionarioInput } from '../models/funcionario.model';
import { AppError } from '../errors/app-error';
import bcrypt from 'bcrypt';



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

     const senhaHash = await bcrypt.hash(input.senha, 12);

    // 3. Se não existir,seguimos com o cadastro 
    return funcionarioRepository.create({
    ...input,
    senha: senhaHash
  });
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
// Se ele estiver tentando alterar a senha, precisamos hashear a nova senha antes de salvar
    if (input.senha) {
    input.senha = await bcrypt.hash(input.senha, 12);
    }

    return funcionarioRepository.update(id, input);

  },

  async remove(id: number) {
    await this.getById(id);
    await funcionarioRepository.delete(id);
  },


async login(email: string, senha: string) {
    const funcionario = await funcionarioRepository.findByEmail(email);

    if (!funcionario) {
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);

    if (!senhaValida) {
      return null;
    }

    const { senha: _, ...dados } = funcionario;
    return dados;
  },

  async alterarSenha(id: number, senha: string) {
    await this.getById(id);

    const hash = await bcrypt.hash(senha, 10);
    return funcionarioRepository.update(id, { senha: hash });
  },

  async delete(id: number) {
    await this.getById(id);
    return funcionarioRepository.delete(id);
  }
};