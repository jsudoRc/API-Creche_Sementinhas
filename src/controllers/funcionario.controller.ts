import { Request, Response, NextFunction } from 'express';
import { funcionarioService } from '../services/funcionario.service';
import { createFuncionarioSchema, loginFuncionarioSchema, updateFuncionarioSchema } from '../schemas/funcionario.schema';

export const funcionarioController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await funcionarioService.list());
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await funcionarioService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createFuncionarioSchema.parse(req.body);
      res.status(201).json(await funcionarioService.create(data));
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginFuncionarioSchema.parse(req.body);
      res.json(await funcionarioService.login(data.email, data.senha));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateFuncionarioSchema.parse(req.body);
      res.json(await funcionarioService.update(Number(req.params.id), data));
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
};
