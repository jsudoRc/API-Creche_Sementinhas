// Criando tabela de turmas para creche
CREATE TABLE IF NOT EXISTS turmas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(80) NOT NULL,
    idade_max INT NOT NULL,
    idade_min INT NOT NULL,
    capacidade INT NOT NULL,
    valor_mensal DECIMAL(10, 2) NOT NULL,
    periodo VARCHAR(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS arquivos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caminho_arquivo TEXT NOT NULL,
      tipo_arquivo TEXT NOT NULL,
      data_upload TEXT DEFAULT CURRENT_TIMESTAMP,

      aluno_id INTEGER NOT NULL,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id)

);
--TABELA FUNCIONÁRIO
CREATE TABLE IF NOT EXISTS funcionarios(
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     nome TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contato_emergencia(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT NOT NULL,
       rg TEXT NOT NULL UNIQUE,
       parentesco TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS responsaveis_transporte(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT NOT NULL,
       rg TEXT NOT NULL UNIQUE,
       parentesco TEXT NOT NULL

);

CREATE TABLE IF NOT EXISTS alunos (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     nome TEXT NOT NULL ,
     data_nasc TEXT NOT NULL,
     andarilha INTEGER DEFAULT 0,
     autorizacao_img INTEGER DEFAULT 0,
     sexo TEXT,
     receita_antitermico TEXT ,
     cirurgia_qual TEXT,
     cirurgia_tempo TEXT,
     observacoes TEXT,


    turma_id INTEGER NOT NULL,
    funcionario_id INTEGER NOT NULL,

    
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- Telefones do Transporte e Emergência
CREATE TABLE IF NOT EXISTS telefones_transporte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL,
    
    transporte_id INTEGER NOT NULL,
    FOREIGN KEY (transporte_id) REFERENCES responsaveis_transporte(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS telefones_emergencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL,
    
    emergencia_id INTEGER NOT NULL,
    FOREIGN KEY (emergencia_id) REFERENCES contato_emergencia(id) ON DELETE CASCADE
);

