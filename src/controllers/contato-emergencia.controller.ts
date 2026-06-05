import { Request, Response, NextFunction } from 'express';
import { contatoEmergenciaService } from '../services/contato-emergencia.service';
import { createContatoEmergenciaSchema, updateContatoEmergenciaSchema } from '../schemas/contato-emergencia.schema';

export const contatoEmergenciaController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await contatoEmergenciaService.list()); } catch (err) { next(err); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json(await contatoEmergenciaService.getById(Number(req.params.id))); } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createContatoEmergenciaSchema.parse(req.body);
      res.status(201).json(await contatoEmergenciaService.create(data));
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateContatoEmergenciaSchema.parse(req.body);
      res.json(await contatoEmergenciaService.update(Number(req.params.id), data));
    } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await contatoEmergenciaService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  }
};