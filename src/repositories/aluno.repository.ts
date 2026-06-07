import { db } from '../config/database';
import { 
    Aluno, 
    CreateAlunoInput, 
    UpdateAlunoInput 
} from '../models/aluno.model';

export const alunoRepository = {
    findAll(): Promise<Aluno[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM alunos ORDER BY id', (err, rows: Aluno[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<Aluno | null> {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM alunos WHERE id = ?', 
                [id], 
                (err, row: Aluno | undefined) => {
                    if (err) reject(err);
                    else resolve(row ?? null);
                }
            );
        });
    },

    create(input: CreateAlunoInput): Promise<Aluno> {
        return new Promise((resolve, reject) => {
            const { 
                nome, data_nasc, andarilha, autorizacao_img, sexo, 
                receita_antitermico, cirurgia_qual, cirurgia_tempo, observacoes, 
                turma_id, funcionario_id 
            } = input;
            
            db.run(
                `INSERT INTO alunos (
                    nome, data_nasc, andarilha, autorizacao_img, sexo, 
                    receita_antitermico, cirurgia_qual, cirurgia_tempo, observacoes, 
                    turma_id, funcionario_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome, data_nasc, andarilha, autorizacao_img, sexo, 
                    receita_antitermico, cirurgia_qual, cirurgia_tempo, observacoes, 
                    turma_id, funcionario_id
                ],
                function (err) {
                    if (err) return reject(err);
                    alunoRepository.findById(this.lastID).then((a) => resolve(a!)).catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateAlunoInput): Promise<Aluno | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.nome !== undefined) { fields.push('nome = ?'); values.push(input.nome); }
            if (input.data_nasc !== undefined) { fields.push('data_nasc = ?'); values.push(input.data_nasc); }
            if (input.andarilha !== undefined) { fields.push('andarilha = ?'); values.push(input.andarilha); }
            if (input.autorizacao_img !== undefined) { fields.push('autorizacao_img = ?'); values.push(input.autorizacao_img); }
            if (input.sexo !== undefined) { fields.push('sexo = ?'); values.push(input.sexo); }
            if (input.receita_antitermico !== undefined) { fields.push('receita_antitermico = ?'); values.push(input.receita_antitermico); }
            if (input.cirurgia_qual !== undefined) { fields.push('cirurgia_qual = ?'); values.push(input.cirurgia_qual); }
            if (input.cirurgia_tempo !== undefined) { fields.push('cirurgia_tempo = ?'); values.push(input.cirurgia_tempo); }
            if (input.observacoes !== undefined) { fields.push('observacoes = ?'); values.push(input.observacoes); }
            if (input.turma_id !== undefined) { fields.push('turma_id = ?'); values.push(input.turma_id); }
            if (input.funcionario_id !== undefined) { fields.push('funcionario_id = ?'); values.push(input.funcionario_id); }

            if (fields.length === 0) {
                return alunoRepository.findById(id).then(resolve).catch(reject);
            }

            values.push(id);
            db.run(
                `UPDATE alunos SET ${fields.join(', ')} WHERE id = ?`, 
                values, 
                function (err) {
                    if (err) return reject(err);
                    alunoRepository.findById(id).then(resolve).catch(reject);
                }
            );
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM alunos WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};