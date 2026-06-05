import { z } from 'zod';


export const createResponsavelEmailSchema = z.object({
    email: z.string().min(2, 'O email é obrigatório.'),
    responsavel_id: z.number().int(),
});

export const updateResponsavelEmailSchema = createResponsavelEmailSchema.partial();