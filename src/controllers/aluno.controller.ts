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
      const foto = files?.foto?.[0]?.path ?? null;

      const data = createAlunoSchema.parse({
        ...req.body,
        autorizacao_img,
        receita_antitermico,
        foto,
        andarilha: Number(req.body.andarilha),
        problema_saude: Number(req.body.problema_saude ?? 0),
        alergia: Number(req.body.alergia ?? 0),
        medicacao_continua: Number(req.body.medicacao_continua ?? 0),
        fratura: Number(req.body.fratura ?? 0),
        mamadeira: Number(req.body.mamadeira ?? 0),
        chupeta: Number(req.body.chupeta ?? 0),
        fralda: Number(req.body.fralda ?? 0),
        restricao_alimentar: Number(req.body.restricao_alimentar ?? 0),
        turma_id: Number(req.body.turma_id),
        funcionario_id: Number(req.body.funcionario_id),
      });

      res.status(201).json(await alunoService.create(data));
    } catch (err) {
      if (files) deletarArquivos(files);
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    try {
      const autorizacao_img = files?.autorizacao_img?.[0]?.path;
      const receita_antitermico = files?.receita_antitermico?.[0]?.path;
      const foto = files?.foto?.[0]?.path;

      const body: any = {
        ...req.body,
        ...(req.body.andarilha !== undefined && { andarilha: Number(req.body.andarilha) }),
        ...(req.body.problema_saude !== undefined && { problema_saude: Number(req.body.problema_saude) }),
        ...(req.body.alergia !== undefined && { alergia: Number(req.body.alergia) }),
        ...(req.body.medicacao_continua !== undefined && { medicacao_continua: Number(req.body.medicacao_continua) }),
        ...(req.body.fratura !== undefined && { fratura: Number(req.body.fratura) }),
        ...(req.body.mamadeira !== undefined && { mamadeira: Number(req.body.mamadeira) }),
        ...(req.body.chupeta !== undefined && { chupeta: Number(req.body.chupeta) }),
        ...(req.body.fralda !== undefined && { fralda: Number(req.body.fralda) }),
        ...(req.body.restricao_alimentar !== undefined && { restricao_alimentar: Number(req.body.restricao_alimentar) }),
        ...(req.body.turma_id !== undefined && { turma_id: Number(req.body.turma_id) }),
        ...(req.body.funcionario_id !== undefined && { funcionario_id: Number(req.body.funcionario_id) }),
      };

      // Só adiciona o arquivo se foi enviado, senão mantém o valor anterior no banco
      if (autorizacao_img !== undefined) body.autorizacao_img = autorizacao_img;
      if (receita_antitermico !== undefined) body.receita_antitermico = receita_antitermico;
      if (foto !== undefined) body.foto = foto;

      const data = updateAlunoSchema.parse(body);

      res.json(await alunoService.update(Number(req.params.id), data));
    } catch (err) {
      if (files) deletarArquivos(files);
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