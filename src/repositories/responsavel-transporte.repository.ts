import { db } from '../config/database';
import { ResponsavelTransporte, CreateResponsavelTransporteInput, UpdateResponsavelTransporteInput } from '../models/responsavel-transporte.model';

export const responsavelTransporteRepository = {
    findAll(): Promise<ResponsavelTransporte[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM responsaveis_transporte ORDER BY id', (err, rows: ResponsavelTransporte[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<ResponsavelTransporte | null> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM responsaveis_transporte WHERE id = ?', [id], (err, row: ResponsavelTransporte | undefined) => {
                if (err) reject(err);
                else resolve(row ?? null);
            });
        });
    },

    create(input: CreateResponsavelTransporteInput): Promise<ResponsavelTransporte> {
        return new Promise((resolve, reject) => {
            const { nome, rg, parentesco } = input;
            db.run(
                'INSERT INTO responsaveis_transporte (nome, rg, parentesco) VALUES (?, ?, ?)',
                [nome, rg, parentesco],
                function (err) {
                    if (err) return reject(err);
                    responsavelTransporteRepository.findById(this.lastID).then((r) => resolve(r!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateResponsavelTransporteInput): Promise<ResponsavelTransporte | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.nome !== undefined) { fields.push('nome = ?'); values.push(input.nome); }
            if (input.rg !== undefined) { fields.push('rg = ?'); values.push(input.rg); }
            if (input.parentesco !== undefined) { fields.push('parentesco = ?'); values.push(input.parentesco); }

            if (fields.length === 0) return responsavelTransporteRepository.findById(id).then(resolve).catch(reject);

            values.push(id);
            db.run(`UPDATE responsaveis_transporte SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                if (err) return reject(err);
                responsavelTransporteRepository.findById(id).then(resolve).catch(reject);
            });
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM responsaveis_transporte WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};