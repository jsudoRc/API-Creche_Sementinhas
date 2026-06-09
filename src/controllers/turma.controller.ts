import { Request, Response, NextFunction } from 'express';
import { turmaService } from '../services/turma.service';
import { createTurmaSchema, updateTurmaSchema } from '../schemas/turma.schema';
import { AppError } from '../errors/app-error';

export const turmaController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const turmas = await turmaService.getAll();
      return res.status(200).json(turmas);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const turma = await turmaService.getById(Number(req.params.id));
      if (!turma) throw new AppError('Turma não encontrada', 404);
      return res.status(200).json(turma);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dadosValidados = createTurmaSchema.parse(req.body);
      const novaTurma = await turmaService.create(dadosValidados);
      return res.status(201).json(novaTurma);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dadosValidados = updateTurmaSchema.parse(req.body);
      const turmaAtualizada = await turmaService.update(Number(req.params.id), dadosValidados);
      return res.status(200).json(turmaAtualizada);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await turmaService.delete(Number(req.params.id));
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};  