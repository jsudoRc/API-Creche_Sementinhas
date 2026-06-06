import { z } from 'zod';

export const createArquivoSchema = z.object({
    caminho_arquivo: z.string().min(1),
    tipo_arquivo: z.string().min(1),
    aluno_id: z.number().int().positive(),
});

export const updateArquivoSchema = createArquivoSchema.partial();