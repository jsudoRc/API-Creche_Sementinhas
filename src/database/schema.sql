CREATE TABLE IF NOT EXISTS contato_emergencia(
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

CREATE TABLE IF NOT EXISTS telefones_emergencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL,
    
    emergencia_id INTEGER NOT NULL,
    FOREIGN KEY (emergencia_id) REFERENCES contato_emergencia(id) ON DELETE CASCADE
);

