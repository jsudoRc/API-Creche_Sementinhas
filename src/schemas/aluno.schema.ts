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

export const updateAlunoSchema = z.object({
    nome: z.string().min(2).optional(),
    data_nasc: z.string().optional(),
    cpf: z.string().min(11).max(11).optional(),
    andarilha: z.number().int().min(0).max(1).optional(),
    autorizacao_img: z.string().nullable().optional(), // sem .default(null)
    sexo: z.enum(['Masculino', 'Feminino']).optional(),
    receita_antitermico: z.string().nullable().optional(), // sem .default(null)
    cirurgia_qual: z.string().nullable().optional(),
    cirurgia_tempo: z.string().nullable().optional(),
    observacoes: z.string().nullable().optional(),
    turma_id: z.number().int().positive().optional(),
    funcionario_id: z.number().int().positive().optional(),
});