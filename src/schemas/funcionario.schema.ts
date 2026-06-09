import { z } from 'zod';

export const createFuncionarioSchema = z.object({
    nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
    email: z.string().email('Formato de e-mail inválido.'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export const updateFuncionarioSchema = createFuncionarioSchema.partial();

export const loginFuncionarioSchema = z.object({
    email: z.string().email('Formato de e-mail inválido.'),
    senha: z.string().min(1, 'A senha é obrigatória.'),
});
