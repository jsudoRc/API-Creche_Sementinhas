import { db } from '../config/database';

export function ensureDefaultFuncionario(): Promise<void> {
  return new Promise((resolve, reject) => {
    const email = 'teste@sementinhas.com';

    db.get('SELECT id FROM funcionarios WHERE email = ?', [email], (findErr, row) => {
      if (findErr) {
        reject(findErr);
        return;
      }

      if (row) {
        resolve();
        return;
      }

      db.run(
        'INSERT INTO funcionarios (nome, email, senha) VALUES (?, ?, ?)',
        ['Funcionário Teste', email, '123456'],
        (insertErr) => {
          if (insertErr) reject(insertErr);
          else resolve();
        }
      );
    });
  });
}
