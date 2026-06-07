import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { alunoService } from '../services/aluno.service';
import { createAlunoSchema, updateAlunoSchema } from '../schemas/aluno.schema';

function deletarArquivos(files: Record<string, Express.Multer.File[]>) {
    Object.values(files).forEach(fileArray => {
        fileArray.forEach(file => {
            fs.unlink(file.path, () => {});
        });
    });
}

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
    const files = req.files as Record<string, Express.Multer.File[]>;
    try {
      const autorizacao_img = files?.autorizacao_img?.[0]?.path ?? null;
      const receita_antitermico = files?.receita_antitermico?.[0]?.path ?? null;

      const data = createAlunoSchema.parse({
        ...req.body,
        autorizacao_img,
        receita_antitermico,
        andarilha: Number(req.body.andarilha),
        turma_id: Number(req.body.turma_id),
        funcionario_id: Number(req.body.funcionario_id),
      });

      res.status(201).json(await alunoService.create(data));
    } catch (err) {
      if (files) deletarArquivos(files); // limpa arquivos se der erro
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    try {
      const autorizacao_img = files?.autorizacao_img?.[0]?.path ?? undefined;
      const receita_antitermico = files?.receita_antitermico?.[0]?.path ?? undefined;

      const data = updateAlunoSchema.parse({
        ...req.body,
        ...(autorizacao_img && { autorizacao_img }),
        ...(receita_antitermico && { receita_antitermico }),
      });

      res.json(await alunoService.update(Number(req.params.id), data));
    } catch (err) {
      if (files) deletarArquivos(files); // limpa arquivos se der erro no update
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