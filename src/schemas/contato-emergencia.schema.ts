import { z } from 'zod';

export const createContatoEmergenciaSchema = z.object({
    nome: z.string().min(2),
    rg: z.string().min(5),
    parentesco: z.string().min(1),
});

export const updateContatoEmergenciaSchema = createContatoEmergenciaSchema.partial();