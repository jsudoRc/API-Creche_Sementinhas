import { z } from 'zod';


export const createResponsavelTelefoneSchema = z.object({
    telefone: z.string().min(2, 'O telefone é obrigatório.'),
    responsavel_id: z.number().int(),
});

export const updateResponsavelTelefoneSchema = createResponsavelTelefoneSchema.partial();