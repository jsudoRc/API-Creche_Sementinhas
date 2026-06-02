import { Request, Response, NextFunction } from 'express';
import { alunoService } from '../services/aluno.service';
import { createAlunoSchema, updateAlunoSchema } from '../schemas/aluno.schema';

export const alunoController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await alunoService.list());
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await alunoService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createAlunoSchema.parse(req.body);
      res.status(201).json(await alunoService.create(data));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateAlunoSchema.parse(req.body);
      res.json(await alunoService.update(Number(req.params.id), data));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await alunoService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};