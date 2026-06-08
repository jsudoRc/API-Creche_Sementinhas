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
                nome, data_nasc, andarilha, cpf, autorizacao_img, sexo, 
                receita_antitermico, cirurgia_qual, cirurgia_tempo, observacoes,
                foto, problema_saude, problema_saude_qual, alergia, alergia_qual,
                medicacao_continua, medicacao_qual, medicacao_tempo, fratura,
                fratura_qual, fratura_tempo, mamadeira, formula_qual,
                formula_quantidade_ml, chupeta, fralda, restricao_alimentar,
                restricao_descricao, cep, endereco, bairro, complemento,
                turma_id, funcionario_id 
            } = input;
            
            db.run(
                `INSERT INTO alunos (
                    nome, data_nasc, andarilha, cpf, autorizacao_img, sexo,
                    receita_antitermico, cirurgia_qual, cirurgia_tempo, observacoes,
                    foto, problema_saude, problema_saude_qual, alergia, alergia_qual,
                    medicacao_continua, medicacao_qual, medicacao_tempo, fratura,
                    fratura_qual, fratura_tempo, mamadeira, formula_qual,
                    formula_quantidade_ml, chupeta, fralda, restricao_alimentar,
                    restricao_descricao, cep, endereco, bairro, complemento,
                    turma_id, funcionario_id
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?
                )`,
                [
                    nome, data_nasc, andarilha, cpf, autorizacao_img, sexo,
                    receita_antitermico, cirurgia_qual, cirurgia_tempo, observacoes,
                    foto, problema_saude, problema_saude_qual, alergia, alergia_qual,
                    medicacao_continua, medicacao_qual, medicacao_tempo, fratura,
                    fratura_qual, fratura_tempo, mamadeira, formula_qual,
                    formula_quantidade_ml, chupeta, fralda, restricao_alimentar,
                    restricao_descricao, cep, endereco, bairro, complemento,
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
            if (input.cpf !== undefined) { fields.push('cpf = ?'); values.push(input.cpf); }
            if (input.andarilha !== undefined) { fields.push('andarilha = ?'); values.push(input.andarilha); }
            if (input.autorizacao_img !== undefined) { fields.push('autorizacao_img = ?'); values.push(input.autorizacao_img); }
            if (input.sexo !== undefined) { fields.push('sexo = ?'); values.push(input.sexo); }
            if (input.receita_antitermico !== undefined) { fields.push('receita_antitermico = ?'); values.push(input.receita_antitermico); }
            if (input.cirurgia_qual !== undefined) { fields.push('cirurgia_qual = ?'); values.push(input.cirurgia_qual); }
            if (input.cirurgia_tempo !== undefined) { fields.push('cirurgia_tempo = ?'); values.push(input.cirurgia_tempo); }
            if (input.observacoes !== undefined) { fields.push('observacoes = ?'); values.push(input.observacoes); }
            if (input.foto !== undefined) { fields.push('foto = ?'); values.push(input.foto); }
            if (input.problema_saude !== undefined) { fields.push('problema_saude = ?'); values.push(input.problema_saude); }
            if (input.problema_saude_qual !== undefined) { fields.push('problema_saude_qual = ?'); values.push(input.problema_saude_qual); }
            if (input.alergia !== undefined) { fields.push('alergia = ?'); values.push(input.alergia); }
            if (input.alergia_qual !== undefined) { fields.push('alergia_qual = ?'); values.push(input.alergia_qual); }
            if (input.medicacao_continua !== undefined) { fields.push('medicacao_continua = ?'); values.push(input.medicacao_continua); }
            if (input.medicacao_qual !== undefined) { fields.push('medicacao_qual = ?'); values.push(input.medicacao_qual); }
            if (input.medicacao_tempo !== undefined) { fields.push('medicacao_tempo = ?'); values.push(input.medicacao_tempo); }
            if (input.fratura !== undefined) { fields.push('fratura = ?'); values.push(input.fratura); }
            if (input.fratura_qual !== undefined) { fields.push('fratura_qual = ?'); values.push(input.fratura_qual); }
            if (input.fratura_tempo !== undefined) { fields.push('fratura_tempo = ?'); values.push(input.fratura_tempo); }
            if (input.mamadeira !== undefined) { fields.push('mamadeira = ?'); values.push(input.mamadeira); }
            if (input.formula_qual !== undefined) { fields.push('formula_qual = ?'); values.push(input.formula_qual); }
            if (input.formula_quantidade_ml !== undefined) { fields.push('formula_quantidade_ml = ?'); values.push(input.formula_quantidade_ml); }
            if (input.chupeta !== undefined) { fields.push('chupeta = ?'); values.push(input.chupeta); }
            if (input.fralda !== undefined) { fields.push('fralda = ?'); values.push(input.fralda); }
            if (input.restricao_alimentar !== undefined) { fields.push('restricao_alimentar = ?'); values.push(input.restricao_alimentar); }
            if (input.restricao_descricao !== undefined) { fields.push('restricao_descricao = ?'); values.push(input.restricao_descricao); }
            if (input.cep !== undefined) { fields.push('cep = ?'); values.push(input.cep); }
            if (input.endereco !== undefined) { fields.push('endereco = ?'); values.push(input.endereco); }
            if (input.bairro !== undefined) { fields.push('bairro = ?'); values.push(input.bairro); }
            if (input.complemento !== undefined) { fields.push('complemento = ?'); values.push(input.complemento); }
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