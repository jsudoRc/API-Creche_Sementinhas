import { z } from 'zod';

export const createResponsavelSchema = z.object({
    nome: z.string().min(2, 'O nome é obrigatório.'),
    cpf: z.string().min(11, 'O CPF deve ter no mínimo 11 caracteres.'),
    cep: z.string().min(8, 'O CEP deve ter no mínimo 8 caracteres.'),
    parentesco: z.string().min(1, 'O parentesco é obrigatório.'),
    
    // Correção aplicada aqui
    profissao: z.string().nullable().default(null), 
    
    responsavel_finance: z.number().int().min(0).max(1),
});

export const updateResponsavelSchema = createResponsavelSchema.partial();