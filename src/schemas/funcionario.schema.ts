import { z } from 'zod';
import bcrypt from 'bcrypt';

export const createFuncionarioSchema = z.object({
    nome: z.string().min(3,'O nome deve ter entre 3 e 64 caracteres').max(64),
    email: z.string().email('Formato de e-mail inválido.').max(150,'O e-mail deve ter no máximo 150 caracteres.'),
    senha: z.string().min(12, 'A senha deve ter no mínimo 12 caracteres.').max(50, 'A senha deve ter no máximo 50 caracteres.').regex(
            /^(?=.*[A-Za-z])(?=.*\d).+$/,
            'A senha deve conter pelo menos uma letra e um número.')  
});

export const updateFuncionarioSchema = createFuncionarioSchema.partial();