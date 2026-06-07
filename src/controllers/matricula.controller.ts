import { Request, Response, NextFunction } from 'express';
import { matriculaService } from '../services/matricula.service';
import { createMatriculaSchema, updateMatriculaSchema } from '../schemas/matricula.schema';

export const matriculaController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await matriculaService.list());
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await matriculaService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createMatriculaSchema.parse(req.body);
      res.status(201).json(await matriculaService.create(data));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateMatriculaSchema.parse(req.body);
      res.json(await matriculaService.update(Number(req.params.id), data));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await matriculaService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};