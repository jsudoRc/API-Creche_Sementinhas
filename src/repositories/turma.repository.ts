//  Criando o repository para a entidade Turma.
import { db } from '../config/database';
import {
    Turma,
    CreateTurmaInput,
    UpdateTurmaInput
} from '../models/turma.model';

export const turmaRepository = {

    findAll(): Promise<Turma[]> {
        return new Promise((resolve, reject) => {

            db.all(
                'SELECT * FROM turmas ORDER BY id',
                (err, rows: Turma[]) => {

                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    findById(id: number): Promise<Turma | null> {
        return new Promise((resolve, reject) => {

            db.get(
                'SELECT * FROM turmas WHERE id = ?',
                [id],
                (err, row: Turma | undefined) => {

                    if (err) reject(err);
                    else resolve(row ?? null);
                }
            );
        });
    },

    // BUSCA PARCIAL POR NOME
    findByName(nome: string): Promise<Turma[]> {

        return new Promise((resolve, reject) => {

            db.all(
                `
                SELECT *
                FROM turmas
                WHERE nome LIKE ?
                ORDER BY nome
                `,
                [`%${nome}%`],
                (err, rows: Turma[]) => {

                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    create(input: CreateTurmaInput): Promise<Turma> {

        return new Promise((resolve, reject) => {

            const {
                nome,
                idade_max,
                idade_min,
                capacidade,
                valor_mensal,
                periodo
            } = input;

            db.run(
                `
                INSERT INTO turmas
                (
                    nome,
                    idade_max,
                    idade_min,
                    capacidade,
                    valor_mensal,
                    periodo
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    nome,
                    idade_max,
                    idade_min,
                    capacidade,
                    valor_mensal,
                    periodo
                ],
                function (err) {

                    if (err) return reject(err);

                    turmaRepository
                        .findById(this.lastID)
                        .then((turma) => resolve(turma!))
                        .catch(reject);
                }
            );
        });
    },

    update(
        id: number,
        input: UpdateTurmaInput
    ): Promise<Turma | null> {

        return new Promise((resolve, reject) => {

            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.nome !== undefined) {
                fields.push('nome = ?');
                values.push(input.nome);
            }

            if (input.idade_max !== undefined) {
                fields.push('idade_max = ?');
                values.push(input.idade_max);
            }

            if (input.idade_min !== undefined) {
                fields.push('idade_min = ?');
                values.push(input.idade_min);
            }

            if (input.capacidade !== undefined) {
                fields.push('capacidade = ?');
                values.push(input.capacidade);
            }

            if (input.valor_mensal !== undefined) {
                fields.push('valor_mensal = ?');
                values.push(input.valor_mensal);
            }

            if (input.periodo !== undefined) {
                fields.push('periodo = ?');
                values.push(input.periodo);
            }

            // SE NENHUM CAMPO FOR ENVIADO
            if (fields.length === 0) {

                return turmaRepository
                    .findById(id)
                    .then(resolve)
                    .catch(reject);
            }

            values.push(id);

            db.run(
                `
                UPDATE turmas
                SET ${fields.join(', ')}
                WHERE id = ?
                `,
                values,
                (err) => {

                    if (err) return reject(err);

                    turmaRepository
                        .findById(id)
                        .then(resolve)
                        .catch(reject);
                }
            );
        });
    },

    delete(id: number): Promise<boolean> {

        return new Promise((resolve, reject) => {

            db.run(
                'DELETE FROM turmas WHERE id = ?',
                [id],
                function (err) {

                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }
};




/*
// ======================================
// EXEMPLOS DE USO
// ======================================

async function exemplos() {

    // ==========================
    // CRIAR TURMA
    // ==========================

    const novaTurma = await turmaRepository.create({
        nome: 'Maternal 1',
        idade_max: 5,
        idade_min: 3,
        capacidade: 20,
        valor_mensal: 850,
        periodo: 'integral'
    });

    console.log('Turma criada:');
    console.log(novaTurma);



    // ==========================
    // BUSCAR TODAS AS TURMAS
    // ==========================

    const todasTurmas = await turmaRepository.findAll();

    console.log('Todas as turmas:');
    console.log(todasTurmas);



    // ==========================
    // BUSCAR POR ID
    // ==========================

    const turmaPorId = await turmaRepository.findById(1);

    console.log('Turma encontrada pelo ID:');
    console.log(turmaPorId);



    // ==========================
    // BUSCA PARCIAL POR NOME
    // ==========================

    const buscaNome = await turmaRepository.findByName('maternal');

    console.log('Resultado da busca por nome:');
    console.log(buscaNome);



    // ==========================
    // ATUALIZAR CAMPOS
    // ==========================

    const turmaAtualizada = await turmaRepository.update(1, {

        capacidade: 25,
        valor_mensal: 950,
        periodo: 'tarde'
    });

    console.log('Turma atualizada:');
    console.log(turmaAtualizada);



    // ==========================
    // DELETAR TURMA
    // ==========================

    const turmaRemovida = await turmaRepository.delete(1);

    console.log('Turma removida?');
    console.log(turmaRemovida);
}



// EXECUTA OS EXEMPLOS
exemplos();
*/