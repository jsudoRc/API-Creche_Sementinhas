import { Request, Response, NextFunction } from 'express';
import { responsavelTransporteService } from '../services/responsavel-transporte.service';
import { createResponsavelTransporteSchema, updateResponsavelTransporteSchema } from '../schemas/responsavel-transporte.schema';

export const responsavelTransporteController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await responsavelTransporteService.list()); } catch (err) { next(err); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json(await responsavelTransporteService.getById(Number(req.params.id))); } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createResponsavelTransporteSchema.parse(req.body);
      res.status(201).json(await responsavelTransporteService.create(data));
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateResponsavelTransporteSchema.parse(req.body);
      res.json(await responsavelTransporteService.update(Number(req.params.id), data));
    } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await responsavelTransporteService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  }
};