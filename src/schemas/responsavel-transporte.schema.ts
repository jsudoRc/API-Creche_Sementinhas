import { z } from 'zod';

export const createResponsavelTransporteSchema = z.object({
    nome: z.string().min(4,'O nome deve ter entre 4 e 64 caracteres').max(64),
    rg: z.string().min(8,'O RG deve ter entre 8 e 10 caracteres.').max(12).regex(
    /^(\d{8,9}|\d{8}[\dA-Za-z]|\d{2}\.\d{3}\.\d{3}-[\dA-Za-z])$/,
    'RG inválido'), // Aceita: 8 ou 9 dígitos, 9 caracteres com letra final, ou formato pontuado com dígito/verificador alfanumérico
    parentesco: z.string().min(3).max(32),
});
    
export const updateResponsavelTransporteSchema = createResponsavelTransporteSchema.partial();