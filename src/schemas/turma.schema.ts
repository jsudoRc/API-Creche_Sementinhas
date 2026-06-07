import { z } from 'zod';

// 1. Criamos um esqueleto PURO apenas com as validações de campo
const baseTurmaSchema = z.object({
    nome: z
        .string()
        .min(1, 'O nome da turma é obrigatório.'),

    idade_min: z
        .number()
        .int('A idade mínima deve ser um número inteiro.')
        .nonnegative('A idade mínima não pode ser negativa.'),

    idade_max: z
        .number()
        .int('A idade máxima deve ser um número inteiro.')
        .positive('A idade máxima deve ser maior que zero.'),

    capacidade: z
        .number()
        .int('A capacidade deve ser um número inteiro.')
        .positive('A capacidade deve ser maior que zero.'),

    valor_mensal: z
        .number()
        .positive('O valor mensal deve ser maior que zero.'),

    periodo: z.enum(
        ['manhã', 'tarde', 'integral'],
        {
            message: 'O período deve ser manhã, tarde ou integral.'
        }
    ),
});

// 2. Schema de criação: Pega o esqueleto puro e adiciona o refine
export const createTurmaSchema = baseTurmaSchema.refine(
    (data) => data.idade_min <= data.idade_max,
    {
        message: 'A idade mínima deve ser menor ou igual à idade máxima.',
        path: ['idade_min']
    }
);

// 3. Schema de atualização: Pega o esqueleto puro, aplica o partial() e DEPOIS o superRefine
export const updateTurmaSchema = baseTurmaSchema
    .partial()
    .superRefine((data, ctx) => {
        if (
            data.idade_min !== undefined &&
            data.idade_max !== undefined &&
            data.idade_min > data.idade_max
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A idade mínima deve ser menor ou igual à idade máxima.',
                path: ['idade_min']
            });
        }
    });