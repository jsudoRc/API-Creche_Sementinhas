import { db } from '../config/database';
import { ContatoEmergencia, CreateContatoEmergenciaInput, UpdateContatoEmergenciaInput } from '../models/contato-emergencia.model';

export const contatoEmergenciaRepository = {
    findAll(): Promise<ContatoEmergencia[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM contato_emergencia ORDER BY id', (err, rows: ContatoEmergencia[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<ContatoEmergencia | null> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM contato_emergencia WHERE id = ?', [id], (err, row: ContatoEmergencia|undefined) => {
                if (err) reject(err);
                else resolve(row ?? null);
            });
        });
    },

    create(input: CreateContatoEmergenciaInput): Promise<ContatoEmergencia> {
        return new Promise((resolve, reject) => {
            const { nome, rg, parentesco } = input;
            db.run(
                'INSERT INTO contato_emergencia (nome, rg, parentesco) VALUES (?, ?, ?)',
                [nome, rg, parentesco],
                function (err) {
                    if (err) return reject(err);
                    contatoEmergenciaRepository.findById(this.lastID).then((r) => resolve(r!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateContatoEmergenciaInput): Promise<ContatoEmergencia | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.nome !== undefined) { fields.push('nome = ?'); values.push(input.nome); }
            if (input.rg !== undefined) { fields.push('rg = ?'); values.push(input.rg); }
            if (input.parentesco !== undefined) { fields.push('parentesco = ?'); values.push(input.parentesco); }

            if (fields.length === 0) return contatoEmergenciaRepository.findById(id).then(resolve).catch(reject);

            values.push(id);
            db.run(`UPDATE contato_emergencia SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                if (err) return reject(err);
                contatoEmergenciaRepository.findById(id).then(resolve).catch(reject);
            });
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM contato_emergencia WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};