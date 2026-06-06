import { db } from '../config/database';
import { Responsavel, CreateResponsavelInput, UpdateResponsavelInput } from '../models/responsavel.model';

export const responsavelRepository = {
    findAll(): Promise<Responsavel[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM responsaveis ORDER BY id', (err, rows: Responsavel[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<Responsavel | null> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM responsaveis WHERE id = ?', [id], (err, row: Responsavel | undefined) => {
                if (err) reject(err);
                else resolve(row ?? null);
            });
        });
    },

    create(input: CreateResponsavelInput): Promise<Responsavel> {
        return new Promise((resolve, reject) => {
            const { nome, cpf, cep, parentesco, profissao, responsavel_finance } = input;
            db.run(
                `INSERT INTO responsaveis (nome, cpf, cep, parentesco, profissao, responsavel_finance) VALUES (?, ?, ?, ?, ?, ?)`,
                [nome, cpf, cep, parentesco, profissao, responsavel_finance],
                function (err) {
                    if (err) return reject(err);
                    responsavelRepository.findById(this.lastID).then((r) => resolve(r!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateResponsavelInput): Promise<Responsavel | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.nome !== undefined) { fields.push('nome = ?'); values.push(input.nome); }
            if (input.cpf !== undefined) { fields.push('cpf = ?'); values.push(input.cpf); }
            if (input.cep !== undefined) { fields.push('cep = ?'); values.push(input.cep); }
            if (input.parentesco !== undefined) { fields.push('parentesco = ?'); values.push(input.parentesco); }
            if (input.profissao !== undefined) { fields.push('profissao = ?'); values.push(input.profissao); }
            if (input.responsavel_finance !== undefined) { fields.push('responsavel_finance = ?'); values.push(input.responsavel_finance); }

            if (fields.length === 0) return responsavelRepository.findById(id).then(resolve).catch(reject);

            values.push(id);
            db.run(`UPDATE responsaveis SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                if (err) return reject(err);
                responsavelRepository.findById(id).then(resolve).catch(reject);
            });
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM responsaveis WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};