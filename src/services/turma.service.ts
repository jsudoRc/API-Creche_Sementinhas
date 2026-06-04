// Criando o service para a entidade Turma.
import {
    Turma,
    CreateTurmaInput,
    UpdateTurmaInput
} from '../models/turma.model';

import { turmaRepository } from '../repositories/turma.repository';

export const turmaService = {

    async listarTurmas(): Promise<Turma[]> {
        return turmaRepository.findAll();
    },

    async buscarPorId(id: number): Promise<Turma | null> {
        return turmaRepository.findById(id);
    },

    async buscarPorNome(nome: string): Promise<Turma[]> {
        return turmaRepository.findByName(nome);
    },

    async criarTurma(
        input: CreateTurmaInput
    ): Promise<Turma> {

        // Regra de negócio
        if (input.idade_min > input.idade_max) {
            throw new Error(
                'A idade mínima não pode ser maior que a idade máxima.'
            );
        }

        return turmaRepository.create(input);
    },

    async atualizarTurma(
        id: number,
        input: UpdateTurmaInput
    ): Promise<Turma | null> {

        const turmaExistente =
            await turmaRepository.findById(id);

        if (!turmaExistente) {
            throw new Error('Turma não encontrada.');
        }

        const idadeMin =
            input.idade_min ?? turmaExistente.idade_min;

        const idadeMax =
            input.idade_max ?? turmaExistente.idade_max;

        if (idadeMin > idadeMax) {
            throw new Error(
                'A idade mínima não pode ser maior que a idade máxima.'
            );
        }

        return turmaRepository.update(id, input);
    },

    async excluirTurma(id: number): Promise<boolean> {

        const turmaExistente =
            await turmaRepository.findById(id);

        if (!turmaExistente) {
            throw new Error('Turma não encontrada.');
        }

        return turmaRepository.delete(id);
    }
};