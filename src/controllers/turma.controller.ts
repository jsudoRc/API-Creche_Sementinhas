// Criando o controller para a entidade Turma.
import { Request, Response } from 'express';
import { turmaService } from '../services/turma.service';

import {
    createTurmaSchema,
    updateTurmaSchema
} from '../schemas/turma.schema';

export const turmaController = {

    async getAll(req: Request, res: Response) {
        try {
            const turmas = await turmaService.getAll();

            return res.status(200).json(turmas);

        } catch (error) {

            return res.status(500).json({
                message: 'Erro ao buscar turmas.'
            });
        }
    },

    async getById(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            const turma = await turmaService.getById(id);

            return res.status(200).json(turma);

        } catch (error: any) {

            return res.status(404).json({
                message: error.message
            });
        }
    },

    async create(req: Request, res: Response) {
        try {

            const dadosValidados =
                createTurmaSchema.parse(req.body);

            const novaTurma =
                await turmaService.create(dadosValidados);

            return res.status(201).json(novaTurma);

        } catch (error: any) {

            return res.status(400).json({
                message: error.message
            });
        }
    },

    async update(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            const dadosValidados =
                updateTurmaSchema.parse(req.body);

            const turmaAtualizada =
                await turmaService.update(
                    id,
                    dadosValidados
                );

            return res.status(200).json(turmaAtualizada);

        } catch (error: any) {

            return res.status(400).json({
                message: error.message
            });
        }
    },

    async delete(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            await turmaService.delete(id);

            return res.status(204).send();

        } catch (error: any) {

            return res.status(404).json({
                message: error.message
            });
        }
    }
};