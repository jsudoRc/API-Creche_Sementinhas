import { db } from '../config/database';
import { ResponsavelTelefone, CreateResponsavelTelefoneInput, UpdateResponsavelTelefoneInput } from '../models/responsavel_telefone.model';

export const responsavelTelefoneRepository = {
    findAll(): Promise<ResponsavelTelefone[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM telefone_responsaveis ORDER BY id', (err, rows: ResponsavelTelefone[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<ResponsavelTelefone | null> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM telefone_responsaveis WHERE id = ?', [id], (err, row: ResponsavelTelefone | undefined) => {
                if (err) reject(err);
                else resolve(row ?? null);
            });
        });
    },

    create(input: CreateResponsavelTelefoneInput): Promise<ResponsavelTelefone> {
        return new Promise((resolve, reject) => {
            const { telefone, responsavel_id } = input;
            db.run(
                `INSERT INTO telefone_responsaveis ( telefone, responsavel_id) VALUES (?, ?)`,
                [telefone, responsavel_id],
                function (err) {
                    if (err) return reject(err);
                    responsavelTelefoneRepository.findById(this.lastID).then((r) => resolve(r!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateResponsavelTelefoneInput): Promise<ResponsavelTelefone | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.telefone !== undefined) { fields.push('telefone = ?'); values.push(input.email); }
            if (input.responsavel_id !== undefined) { fields.push('responsavel_id = ?'); values.push(input.responsavel_id); }

            if (fields.length === 0) return responsavelTelefoneRepository.findById(id).then(resolve).catch(reject);

            values.push(id);
            db.run(`UPDATE telefone_responsaveis SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                if (err) return reject(err);
                responsavelTelefoneRepository.findById(id).then(resolve).catch(reject);
            });
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM telefone_responsaveis WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};