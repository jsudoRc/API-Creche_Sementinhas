import { z } from 'zod';

export const createMatriculaSchema = z.object({
    plano: z.string().min(1),
    valor_mensalidade: z.number().positive('O valor deve ser maior que zero.'),
    data_venc: z.number().int().min(1).max(31, 'O dia de vencimento deve ser entre 1 e 31.'),
    inicio_vigencia: z.string(),
    fim_vigencia: z.string(),
    forma_pagamento: z.string().min(1),
    
    // Correção aplicada aqui
    data_saida: z.string().nullable().default(null),
    
    aluno_id: z.number().int().positive(),
});

export const updateMatriculaSchema = createMatriculaSchema.partial();