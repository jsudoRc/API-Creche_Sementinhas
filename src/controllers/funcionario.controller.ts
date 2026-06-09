import { Request, Response, NextFunction } from 'express';
import { funcionarioService } from '../services/funcionario.service';
import { createFuncionarioSchema, updateFuncionarioSchema } from '../schemas/funcionario.schema';

export const funcionarioController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const funcionarios = await funcionarioService.list();
      const response = funcionarios.map(({ senha, ...f }) => f);
      res.json(response);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const funcionario = await funcionarioService.getById(Number(req.params.id));
      const { senha, ...response } = funcionario;
      res.json(response);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createFuncionarioSchema.parse(req.body);
      const funcionario = await funcionarioService.create(data);
      const { senha, ...response } = funcionario;
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateFuncionarioSchema.parse(req.body);
      const funcionario = await funcionarioService.update(Number(req.params.id), data);
      const { senha, ...response } = funcionario!;
      res.json(response);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await funcionarioService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;
      const funcionario = await funcionarioService.login(email, senha);
      if (!funcionario) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }
      return res.status(200).json({ message: 'Login realizado com sucesso', funcionario });
    } catch (err) {
      next(err);
    }
  },

  async alterarSenha(req: Request, res: Response, next: NextFunction) {
    try {
      const { senha } = req.body;
      await funcionarioService.alterarSenha(Number(req.params.id), senha);
      return res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (err) {
      next(err);
    }
  },
};