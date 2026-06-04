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