import { db } from '../config/database';
import { Arquivo, CreateArquivoInput, UpdateArquivoInput } from '../models/arquivo.model';

export const arquivoRepository = {
    findAll(): Promise<Arquivo[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM arquivos ORDER BY id', (err, rows: Arquivo[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<Arquivo | null> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM arquivos WHERE id = ?', [id], (err, row: Arquivo | undefined) => {
                if (err) reject(err);
                else resolve(row ?? null);
            });
        });
    },

    create(input: CreateArquivoInput): Promise<Arquivo> {
        return new Promise((resolve, reject) => {
            const { caminho_arquivo, tipo_arquivo, aluno_id } = input;
            db.run(
                'INSERT INTO arquivos (caminho_arquivo, tipo_arquivo, aluno_id) VALUES (?, ?, ?)',
                [caminho_arquivo, tipo_arquivo, aluno_id],
                function (err) {
                    if (err) return reject(err);
                    arquivoRepository.findById(this.lastID).then((a) => resolve(a!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateArquivoInput): Promise<Arquivo | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.caminho_arquivo !== undefined) { fields.push('caminho_arquivo = ?'); values.push(input.caminho_arquivo); }
            if (input.tipo_arquivo !== undefined) { fields.push('tipo_arquivo = ?'); values.push(input.tipo_arquivo); }
            if (input.aluno_id !== undefined) { fields.push('aluno_id = ?'); values.push(input.aluno_id); }

            if (fields.length === 0) return arquivoRepository.findById(id).then(resolve).catch(reject);

            values.push(id);
            db.run(`UPDATE arquivos SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                if (err) return reject(err);
                arquivoRepository.findById(id).then(resolve).catch(reject);
            });
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM arquivos WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};