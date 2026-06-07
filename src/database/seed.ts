import { db } from '../config/database';

db.serialize(() => {
  // 1. Limpamos as tabelas principais para não duplicar dados se você rodar o seed duas vezes
  db.run('DELETE FROM alunos');
  db.run('DELETE FROM funcionarios');
  db.run('DELETE FROM turmas');

  // 2. Inserimos algumas Turmas iniciais
  db.run('INSERT INTO turmas (categoria, capacidade_max) VALUES (?, ?)', [
    'Berçário',
    10,
  ]);
  db.run('INSERT INTO turmas (categoria, capacidade_max) VALUES (?, ?)', [
    'Maternal I',
    15,
  ]);

  // 3. Inserimos alguns Funcionários
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