-- ==========================================
-- 1. TABELAS BASE (Não dependem de nenhuma outra)
-- ==========================================
CREATE TABLE IF NOT EXISTS turmas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    idade_max INTEGER NOT NULL,
    idade_min INTEGER NOT NULL,
    capacidade INTEGER NOT NULL,
    valor_mensal REAL NOT NULL,
    periodo TEXT NOT NULL
);

--TABELA FUNCIONÁRIO
CREATE TABLE IF NOT EXISTS funcionarios(
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     nome TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     senha TEXT NOT NULL,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
     updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
     status INTEGER DEFAULT 1,
     login TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS responsaveis(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT NOT NULL,
       cpf TEXT NOT NULL UNIQUE,
       cep TEXT NOT NULL,
       parentesco TEXT NOT NULL,
       profissao TEXT,
       responsavel_finance INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS responsaveis_transporte(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT NOT NULL,
       rg TEXT NOT NULL UNIQUE,
       parentesco TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contato_emergencia(
       id           INTEGER PRIMARY KEY AUTOINCREMENT,
       nome         VARCHAR (150) NOT NULL,
       rg           VARCHAR (11) NOT NULL UNIQUE,
       parentesco   VARCHAR (20) NOT NULL
);

-- ==========================================
-- 2. TABELAS DE NÍVEL 1 (Dependem das tabelas Base)
-- ==========================================
CREATE TABLE IF NOT EXISTS alunos (
     id                     INTEGER PRIMARY KEY AUTOINCREMENT,
     nome                   VARCHAR (150)   NOT NULL,
     data_nasc              VARCHAR (10)    NOT NULL,
     CPF                    VARCHAR (14)    NOT NULL UNIQUE,
     andarilha              INTEGER         DEFAULT 0,
     autorizacao_img        VARCHAR (500)   NULL,
     sexo                   VARCHAR (10)    NOT NULL,
     receita_antitermico    VARCHAR (500)   NULL,
     cirurgia_qual          VARCHAR (250)   NULL,
     cirurgia_tempo         VARCHAR (250)   NULL,
     observacoes            TEXT            NULL,
     foto                   VARCHAR (500)   NULL,
     problema_saude         INTEGER         DEFAULT 0,
     problema_saude_qual    VARCHAR (255)   NULL,
     alergia                INTEGER         DEFAULT 0,
     alergia_qual           VARCHAR (255)   NULL,
     medicacao_continua     INTEGER         DEFAULT 0,
     medicacao_qual         VARCHAR (255)   NULL,
     medicacao_tempo        VARCHAR (100)   NULL,
     fratura                INTEGER         DEFAULT 0,
     fratura_qual           VARCHAR (255)   NULL,
     fratura_tempo          VARCHAR (100)   NULL,
     mamadeira              INTEGER         DEFAULT 0,
     formula_qual           VARCHAR (255)   NULL,
     formula_quantidade_ml  VARCHAR (50)    NULL,
     chupeta                INTEGER         DEFAULT 0,
     fralda                 INTEGER         DEFAULT 0,
     restricao_alimentar    INTEGER         DEFAULT 0,
     restricao_descricao    TEXT            NULL,
     cep                    VARCHAR (9)     NULL,
     endereco               VARCHAR (255)   NULL,
     bairro                 VARCHAR (100)   NULL,
     complemento            VARCHAR (100)   NULL,

     turma_id               INTEGER         NOT NULL,
     funcionario_id         INTEGER         NOT NULL,

     CONSTRAINT fk_alunos_turma
         FOREIGN KEY (turma_id)
         REFERENCES turmas(id)
         ON DELETE RESTRICT
         ON UPDATE CASCADE,

     CONSTRAINT fk_alunos_funcionario
         FOREIGN KEY (funcionario_id)
         REFERENCES funcionarios(id)
         ON DELETE RESTRICT
         ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS telefones_responsaveis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL,
    responsavel_id INTEGER NOT NULL,
    FOREIGN KEY (responsavel_id) REFERENCES responsaveis(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS emails_responsaveis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    responsavel_id INTEGER NOT NULL,
    FOREIGN KEY (responsavel_id) REFERENCES responsaveis(id) ON DELETE CASCADE
);

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

-- ==========================================
-- 3. TABELAS DE NÍVEL 2 (Dependem da tabela Alunos)
-- ==========================================
CREATE TABLE IF NOT EXISTS arquivos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caminho_arquivo TEXT NOT NULL,
      tipo_arquivo TEXT NOT NULL,
      data_upload TEXT DEFAULT CURRENT_TIMESTAMP,
      aluno_id INTEGER NOT NULL,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

CREATE TABLE IF NOT EXISTS matriculas(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       plano TEXT NOT NULL,
       valor_mensalidade REAL NOT NULL,
       data_venc INTEGER NOT NULL,
       inicio_vigencia TEXT NOT NULL,
       fim_vigencia TEXT NOT NULL,
       forma_pagamento TEXT NOT NULL, 
       data_saida TEXT,
       aluno_id INTEGER NOT NULL,
       FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

-- ==========================================
-- 4. TABELAS ASSOCIATIVAS
-- ==========================================
CREATE TABLE IF NOT EXISTS alunos_responsaveis (
    aluno_id INTEGER NOT NULL,
    responsavel_id INTEGER NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (responsavel_id) REFERENCES responsaveis(id) ON DELETE CASCADE,
    PRIMARY KEY (aluno_id, responsavel_id)
);

CREATE TABLE IF NOT EXISTS alunos_transporte (
    aluno_id INTEGER NOT NULL,
    transporte_id INTEGER NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (transporte_id) REFERENCES responsaveis_transporte(id) ON DELETE CASCADE,
    PRIMARY KEY (aluno_id, transporte_id)
);

CREATE TABLE IF NOT EXISTS alunos_emergencia (
    aluno_id INTEGER NOT NULL,
    emergencia_id INTEGER NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (emergencia_id) REFERENCES contato_emergencia(id) ON DELETE CASCADE,
    PRIMARY KEY (aluno_id, emergencia_id)
);