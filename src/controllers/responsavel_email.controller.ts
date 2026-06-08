import { Request, Response, NextFunction } from 'express';
import { responsavelEmailService } from '../services/responsavel_email.service';
import { createResponsavelEmailSchema, updateResponsavelEmailSchema } from '../schemas/responsavel_email.schema';

export const responsavelEmailController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await responsavelEmailService.list());
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await responsavelEmailService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createResponsavelEmailSchema.parse(req.body);
      res.status(201).json(await responsavelEmailService.create(data));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateResponsavelEmailSchema.parse(req.body);
      res.json(await responsavelEmailService.update(Number(req.params.id), data));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await responsavelEmailService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};