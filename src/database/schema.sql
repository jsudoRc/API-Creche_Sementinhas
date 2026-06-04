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