import { z } from 'zod';

export const createAlunoSchema = z.object({
    nome: z.string().min(2, 'O nome é obrigatório.'),
    data_nasc: z.string(),
    cpf: z.string().min(11, 'O CPF deve conter 11 caracteres.').max(11, 'O CPF deve conter 11 caracteres.'),
    andarilha: z.number().int().min(0).max(1),
    autorizacao_img: z.string().nullable().default(null),
    sexo: z.enum(['Masculino', 'Feminino']),
    receita_antitermico: z.string().nullable().default(null),
    cirurgia_qual: z.string().nullable().default(null),
    cirurgia_tempo: z.string().nullable().default(null),
    observacoes: z.string().nullable().default(null),
    
    turma_id: z.number().int().positive(),
    funcionario_id: z.number().int().positive(),
});

export const updateAlunoSchema = createAlunoSchema.partial();