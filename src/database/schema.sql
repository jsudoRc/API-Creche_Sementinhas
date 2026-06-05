-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios(
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     nome TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     senha TEXT NOT NULL
);

-- Tabela de responsáveis pelo transporte
CREATE TABLE IF NOT EXISTS responsaveis_transporte(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome TEXT NOT NULL,
       rg TEXT NOT NULL UNIQUE,
       parentesco TEXT NOT NULL

);

--Telefones do Transporte e Emergência
CREATE TABLE IF NOT EXISTS telefones_transporte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT NOT NULL,
    
    transporte_id INTEGER NOT NULL,
    FOREIGN KEY (transporte_id) REFERENCES responsaveis_transporte(id) ON DELETE CASCADE
);
