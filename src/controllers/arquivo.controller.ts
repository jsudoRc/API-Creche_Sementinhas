import { Request, Response, NextFunction } from 'express';
import { arquivoService } from '../services/arquivo.service';
import { createArquivoSchema, updateArquivoSchema } from '../schemas/arquivo.schema';

export const arquivoController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await arquivoService.list()); } catch (err) { next(err); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json(await arquivoService.getById(Number(req.params.id))); } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createArquivoSchema.parse(req.body);
      res.status(201).json(await arquivoService.create(data));
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateArquivoSchema.parse(req.body);
      res.json(await arquivoService.update(Number(req.params.id), data));
    } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await arquivoService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  }
};