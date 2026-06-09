import { funcionarioRepository } from '../repositories/funcionario.repository';
import { CreateFuncionarioInput, UpdateFuncionarioInput } from '../models/funcionario.model';
import { AppError } from '../errors/app-error';
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12; // ← constante centralizada (antes era 12 no create e 10 no alterarSenha)

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
    const emailJaExiste = await funcionarioRepository.findByEmail(input.email);
    if (emailJaExiste) {
      throw new AppError('E-mail já cadastrado no sistema', 409);
    }
    const senhaHash = await bcrypt.hash(input.senha, BCRYPT_ROUNDS);
    return funcionarioRepository.create({ ...input, senha: senhaHash });
  },

  async update(id: number, input: UpdateFuncionarioInput) {
    await this.getById(id);
    if (input.email) {
      const emailJaExiste = await funcionarioRepository.findByEmail(input.email);
      if (emailJaExiste && emailJaExiste.id !== id) {
        throw new AppError('Este e-mail já está sendo usado por outro funcionário', 409);
      }
    }
    if (input.senha) {
      input.senha = await bcrypt.hash(input.senha, BCRYPT_ROUNDS);
    }
    return funcionarioRepository.update(id, input);
  },

  async remove(id: number) {
    await this.getById(id);
    await funcionarioRepository.delete(id);
  },

  async login(email: string, senha: string) {
    const funcionario = await funcionarioRepository.findByEmail(email);
    if (!funcionario) return null;
    const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    if (!senhaValida) return null;
    const { senha: _, ...dados } = funcionario;
    return dados;
  },

  async alterarSenha(id: number, senha: string) {
    await this.getById(id);
    const hash = await bcrypt.hash(senha, BCRYPT_ROUNDS);
    return funcionarioRepository.update(id, { senha: hash });
  },
};