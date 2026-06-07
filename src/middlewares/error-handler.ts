import { Request,Response,NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";

export function errorHandler(
    err:unknown,
    _req: Request,
    res: Response,
    _next:NextFunction
){
    // Captura erros de validação dos nossos Schemas (ex: faltou a senha)
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
  }

  // Captura os nossos erros customizados (ex: "Turma não encontrada", 404)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Se for um erro que a gente não previu (banco caiu, etc), retorna 500
  console.error(err);
  return res.status(500).json({ error: 'Erro interno no servidor' });
}