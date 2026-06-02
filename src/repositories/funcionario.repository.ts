import { promise } from 'zod';
import { db } from '../config/database';
import { 
    Funcionario, 
    CreateFuncionarioInput, 
    UpdateFuncionarioInput 
} from '../models/funcionario.model';
import { release } from 'node:os';

export const funcionarioRepository = {
    findAll(): Promise<Funcionario[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM funcionarios ORDER BY id', (err, rows: Funcionario[]) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id: number): Promise<Funcionario | null> {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM funcionarios WHERE id = ?', 
                [id], 
                (err, row: Funcionario | undefined) => {
                    if (err) reject(err);
                    else resolve(row ?? null);
                }
            );
        });
    },

    findByEmail(email:string):Promise <Funcionario | null>{
        return new Promise((resolve,reject)=>{
            db.get('SELECT * FROM funcionarios WHERE email =?',[email],(err,row: Funcionario | undefined)=>{

                if(err) reject(err)
                else resolve(row??null)
            })
        })
    },

    create(input: CreateFuncionarioInput): Promise<Funcionario> {
        return new Promise((resolve, reject) => {
            const { nome, email, senha } = input;
            db.run(
                'INSERT INTO funcionarios (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, senha],
                function (err) {
                    if (err) return reject(err);
                    
                    funcionarioRepository
                        .findById(this.lastID)
                        .then((f) => resolve(f!))
                        .catch(reject);
                }
            );
        });
    },

    update(id: number, input: UpdateFuncionarioInput): Promise<Funcionario | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.nome !== undefined) {
                fields.push('nome = ?');
                values.push(input.nome);
            }
            if (input.email !== undefined) {
                fields.push('email = ?');
                values.push(input.email);
            }
            if (input.senha !== undefined) {
                fields.push('senha = ?');
                values.push(input.senha);
            }

            if (fields.length === 0) {
                return funcionarioRepository.findById(id).then(resolve).catch(reject);
            }

            values.push(id);
            db.run(
                `UPDATE funcionarios SET ${fields.join(', ')} WHERE id = ?`, 
                values, 
                function (err) {
                    if (err) return reject(err);
                    funcionarioRepository.findById(id).then(resolve).catch(reject);
                }
            );
        });
    },

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM funcionarios WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes > 0);
            });
        });
    },
};