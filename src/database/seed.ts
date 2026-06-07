import { db } from '../config/database';

db.serialize(() => {
  // 1. Limpamos as tabelas principais para não duplicar dados
  db.run('DELETE FROM alunos');
  db.run('DELETE FROM funcionarios');
  db.run('DELETE FROM turmas');

  // 2. Inserimos algumas Turmas iniciais com as NOVAS colunas do schema
  db.run(`INSERT INTO turmas (nome, idade_min, idade_max, capacidade, valor_mensal, periodo) 
          VALUES (?, ?, ?, ?, ?, ?)`, [
    'Berçário', 
    0,          // idade_min (0 anos/meses)
    1,          // idade_max (1 ano)
    10,         // capacidade
    850.00,     // valor_mensal
    'integral'  // periodo
  ]);

  db.run(`INSERT INTO turmas (nome, idade_min, idade_max, capacidade, valor_mensal, periodo) 
          VALUES (?, ?, ?, ?, ?, ?)`, [
    'Maternal I', 
    2,          // idade_min
    3,          // idade_max
    15,         // capacidade
    700.00,     // valor_mensal
    'tarde'     // periodo
  ]);

  // 3. Inserimos alguns Funcionários (O schema deles continuou igual)
  db.run('INSERT INTO funcionarios (nome, email, senha) VALUES (?, ?, ?)', [
    'Tia Maria',
    'maria@sementinhas.com',
    'senha123', // Em um sistema real, essa senha seria criptografada!
  ]);
  
  db.run('INSERT INTO funcionarios (nome, email, senha) VALUES (?, ?, ?)', [
    'Tio João (Secretaria)',
    'joao@sementinhas.com',
    'admin123',
  ]);

  console.log('Seed executado com sucesso! A creche já tem turmas e funcionários.');
});