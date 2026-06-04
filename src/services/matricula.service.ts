import { db } from '../config/database';
import { Matricula, CreateMatriculaInput, UpdateMatriculaInput } from '../models/matricula.model';

export const matriculaRepository = {
    findAll(): Promise<Matricula[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM matriculas ORDER BY id', (err, rows: Matricula[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<Matricula | null> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM matriculas WHERE id = ?', [id], (err, row: Matricula | undefined) => {
                if (err) reject(err);
                else resolve(row ?? null);
            });
        });
    },

    create(input: CreateMatriculaInput): Promise<Matricula> {
        return new Promise((resolve, reject) => {
            const { plano, valor_mensalidade, data_venc, inicio_vigencia, fim_vigencia, forma_pagamento, data_saida, aluno_id } = input;
            db.run(
                `INSERT INTO matriculas (plano, valor_mensalidade, data_venc, inicio_vigencia, fim_vigencia, forma_pagamento, data_saida, aluno_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [plano, valor_mensalidade, data_venc, inicio_vigencia, fim_vigencia, forma_pagamento, data_saida, aluno_id],
                function (err) {
                    if (err) return reject(err);
                    matriculaRepository.findById(this.lastID).then((m) => resolve(m!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateMatriculaInput): Promise<Matricula | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.plano !== undefined) { fields.push('plano = ?'); values.push(input.plano); }
            if (input.valor_mensalidade !== undefined) { fields.push('valor_mensalidade = ?'); values.push(input.valor_mensalidade); }
            if (input.data_venc !== undefined) { fields.push('data_venc = ?'); values.push(input.data_venc); }
            if (input.inicio_vigencia !== undefined) { fields.push('inicio_vigencia = ?'); values.push(input.inicio_vigencia); }
            if (input.fim_vigencia !== undefined) { fields.push('fim_vigencia = ?'); values.push(input.fim_vigencia); }
            if (input.forma_pagamento !== undefined) { fields.push('forma_pagamento = ?'); values.push(input.forma_pagamento); }
            if (input.data_saida !== undefined) { fields.push('data_saida = ?'); values.push(input.data_saida); }
            if (input.aluno_id !== undefined) { fields.push('aluno_id = ?'); values.push(input.aluno_id); }

            if (fields.length === 0) return matriculaRepository.findById(id).then(resolve).catch(reject);

            values.push(id);
            db.run(`UPDATE matriculas SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                if (err) return reject(err);
                matriculaRepository.findById(id).then(resolve).catch(reject);
            });
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM matriculas WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};