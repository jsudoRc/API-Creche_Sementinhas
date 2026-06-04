CREATE TABLE IF NOT EXISTS arquivos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caminho_arquivo TEXT NOT NULL,
      tipo_arquivo TEXT NOT NULL,
      data_upload TEXT DEFAULT CURRENT_TIMESTAMP,

      aluno_id INTEGER NOT NULL,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id)

);