# 🌱 API Creche Sementinhas

API REST para gerenciamento de uma creche, desenvolvida com Node.js, TypeScript, Express e SQLite. Permite o controle de alunos, turmas, funcionários, matrículas, responsáveis e muito mais.

## 👥 Integrantes

- Vitor
- Ezequiel
- Gabriel Cruz
- Jonas
- Beatriz
- Julio

🎓 Curso de Análise e Desenvolvimento de Sistemas — 2º Semestre
**Fatec Indaiatuba**

---

## 💡 Sobre o Projeto

A Creche Sementinhas, com três anos de atuação, ainda não conta com um sistema próprio de gestão. Para o controle de aproximadamente 50 crianças matriculadas, a instituição depende de métodos manuais e planilhas de Excel isoladas — uma realidade que gera redundância de dados, falhas na comunicação interna e dificuldades no acompanhamento financeiro.

Diante dessa necessidade de modernização, este projeto foi desenvolvido como trabalho acadêmico da turma do 2º semestre do curso de Análise e Desenvolvimento de Sistemas da Fatec Indaiatuba. O objetivo é entregar um módulo de Sistema de Informação focado em **Cadastro e Matrícula**, substituindo os processos manuais por uma API estruturada que centraliza e organiza os dados da creche de forma confiável e escalável.

---

## 📋 Requisitos Levantados

Os requisitos abaixo foram levantados em reunião com os responsáveis pela creche e orientaram o desenvolvimento do sistema.

**Acesso e autenticação**
- Login com usuário e senha, permitindo que usuários identificados realizem alterações e observações nos cadastros.

**Cadastro de responsáveis**
- Interface de preenchimento de dados simplificada.
- Dados dos responsáveis inseridos no sistema serão utilizados para preenchimento automático do contrato.
- Campo específico para identificação do **responsável financeiro**, cujos dados poderão ser reaproveitados na geração de boletos e e-mails de cobrança.
- Campo separado para listar as **pessoas autorizadas a buscar a criança** na creche.

**Cadastro de alunos**
- Dados das crianças inseridos no sistema serão usados para preenchimento automático da ficha de anamnese e do contrato.
- A **idade da criança** deverá ser calculada automaticamente a partir da data de nascimento, atualizando o valor da mensalidade quando houver aniversário.
- Destaque para crianças **"andarilhas"** (crianças mais velhas que permanecem na mesma turma por adaptação): o valor da mensalidade dessas crianças deve ser calculado com base na idade, não na turma.
- Autorização de uso de imagem preenchida em campo de seleção, com reaproveitamento automático no contrato e na ficha de anamnese.

**Matrícula e contrato**
- Seleção de período contratado (integral, manhã ou tarde) realizada uma única vez, com reaproveitamento automático no contrato.
- Opção de pagamento da matrícula (à vista ou parcelado, boleto ou cartão) registrada em campo de seleção para uso automático no contrato.
- Campos de assinatura, local e data preenchidos automaticamente com base nos dados da ficha de matrícula.
- Tela ou campo com indicação de **aviso prévio/multa**, com cálculo automático de pendência a partir da data de saída informada.

**Arquivos e documentos**
- Upload de documentos vinculados ao aluno (fotos 3x4, atestados médicos, receitas, laudos, certidões) diretamente para a pasta do aluno no sistema.

> Novas funcionalidades poderão ser incorporadas ao longo do desenvolvimento, conforme decisão em grupo.

---

## 🛠️ Tecnologias

- **Node.js** com **TypeScript**
- **Express 5**
- **SQLite3** — banco de dados local
- **Zod** — validação de dados
- **tsx** — execução de TypeScript em desenvolvimento

---

## 📁 Estrutura do Projeto

```
src/
├── app.ts                  # Configuração do Express
├── server.ts               # Inicialização do servidor
├── config/
│   └── database.ts         # Conexão com o SQLite
├── database/
│   ├── init.ts             # Criação das tabelas
│   ├── schema.sql          # Schema do banco de dados
│   └── seed.ts             # Dados iniciais
├── controllers/            # Recebem as requisições HTTP
├── services/               # Regras de negócio
├── repositories/           # Acesso ao banco de dados
├── routes/                 # Definição das rotas
├── models/                 # Tipos e interfaces
├── schemas/                # Validações com Zod
├── middlewares/            # Tratamento de erros
└── errors/                 # Classes de erro customizadas
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js instalado
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/jsudoRc/API-Creche_Sementinhas.git
cd API-Creche_Sementinhas

# Instale as dependências
npm install
```

### Banco de Dados

```bash
# Cria as tabelas no banco
npm run db:init

# (Opcional) Popula com dados iniciais
npm run db:seed
```

### Rodando a API

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm run build
npm start
```

O servidor estará disponível em: `http://localhost:3000`

---

## 📌 Endpoints

Todos os recursos seguem o padrão REST com os verbos `GET`, `POST`, `PUT` e `DELETE`.

| Recurso                    | Rota base                    |
|----------------------------|------------------------------|
| Turmas                     | `/turmas`                    |
| Funcionários               | `/funcionarios`              |
| Alunos                     | `/alunos`                    |
| Responsáveis               | `/responsaveis`              |
| Matrículas                 | `/matriculas`                |
| Arquivos                   | `/arquivos`                  |
| Responsáveis de Transporte | `/responsaveis-transporte`   |
| Contatos de Emergência     | `/contatos-emergencia`       |

### Exemplo de rotas para `/turmas`

| Método | Rota          | Descrição              |
|--------|---------------|------------------------|
| GET    | `/turmas`     | Lista todas as turmas  |
| GET    | `/turmas/:id` | Busca turma por ID     |
| POST   | `/turmas`     | Cria uma nova turma    |
| PUT    | `/turmas/:id` | Atualiza uma turma     |
| DELETE | `/turmas/:id` | Remove uma turma       |

> Os demais recursos seguem a mesma estrutura de rotas.

---

## 🗄️ Banco de Dados

O banco utiliza **SQLite** e o arquivo `database.db` é gerado automaticamente na raiz do projeto.

### Principais tabelas

- **turmas** — nome, faixa etária, capacidade, valor mensal e período
- **funcionarios** — nome, e-mail e senha
- **alunos** — dados pessoais, informações de saúde, vinculados a uma turma e a um funcionário
- **responsaveis** — CPF, parentesco, endereço e responsabilidade financeira
- **responsaveis_transporte** — responsáveis pelo transporte dos alunos
- **contato_emergencia** — contatos para emergências
- **matriculas** — plano, valor, forma de pagamento e vigência
- **arquivos** — documentos vinculados a alunos

As chaves estrangeiras estão habilitadas via `PRAGMA foreign_keys = ON`.

---

## 📄 Licença

ISC
