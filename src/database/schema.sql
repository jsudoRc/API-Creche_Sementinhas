// Criando a tabela de turmas da creche 
CREATE TABLE IF NOT EXISTS turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    idade_max INT NOT NULL,
    idade_min INT NOT NULL,
    capacidade INT NOT NULL,
    valor_mensal DECIMAL(10, 2) NOT NULL
);