import { db } from '../config/database';
import { ResponsavelEmail, CreateResponsavelEmailInput, UpdateResponsavelEmailInput } from '../models/responsavel_email.model';

export const responsavelEmailRepository = {
    findAll(): Promise<ResponsavelEmail[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM emails_responsaveis ORDER BY id', (err, rows: ResponsavelEmail[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<ResponsavelEmail | null> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM emails_responsaveis WHERE id = ?', [id], (err, row: ResponsavelEmail | undefined) => {
                if (err) reject(err);
                else resolve(row ?? null);
            });
        });
    },

    create(input: CreateResponsavelEmailInput): Promise<ResponsavelEmail> {
        return new Promise((resolve, reject) => {
            const { email, responsavel_id } = input;
            db.run(
                `INSERT INTO email_responsaveis ( email, responsavel_id) VALUES (?, ?)`,
                [email, responsavel_id],
                function (err) {
                    if (err) return reject(err);
                    responsavelEmailRepository.findById(this.lastID).then((r) => resolve(r!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateResponsavelEmailInput): Promise<ResponsavelEmail | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.email !== undefined) { fields.push('email = ?'); values.push(input.email); }
            if (input.responsavel_id !== undefined) { fields.push('responsavel_id = ?'); values.push(input.responsavel_id); }

            if (fields.length === 0) return responsavelEmailRepository.findById(id).then(resolve).catch(reject);

            values.push(id);
            db.run(`UPDATE emails_responsaveis SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                if (err) return reject(err);
                responsavelEmailRepository.findById(id).then(resolve).catch(reject);
            });
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM emails_responsaveis WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};