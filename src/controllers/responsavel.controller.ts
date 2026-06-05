import { Request, Response, NextFunction } from 'express';
import { responsavelService } from '../services/responsavel.service';
import { createResponsavelSchema, updateResponsavelSchema } from '../schemas/responsavel.schema';

export const responsavelController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await responsavelService.list());
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await responsavelService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createResponsavelSchema.parse(req.body);
      res.status(201).json(await responsavelService.create(data));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateResponsavelSchema.parse(req.body);
      res.json(await responsavelService.update(Number(req.params.id), data));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await responsavelService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};