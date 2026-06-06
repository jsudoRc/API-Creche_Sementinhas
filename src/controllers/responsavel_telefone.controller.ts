import { Request, Response, NextFunction } from 'express';
import { responsavelTelefoneService } from '../services/responsavel_telefone.service';
import { createResponsavelTelefoneSchema, updateResponsavelTelefoneSchema } from '../schemas/responsavel_telefone.schema';

export const responsavelTelefoneController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await responsavelTelefoneService.list());
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await responsavelTelefoneService.getById(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createResponsavelTelefoneSchema.parse(req.body);
      res.status(201).json(await responsavelTelefoneService.create(data));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateResponsavelTelefoneSchema.parse(req.body);
      res.json(await responsavelTelefoneService.update(Number(req.params.id), data));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await responsavelTelefoneService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};