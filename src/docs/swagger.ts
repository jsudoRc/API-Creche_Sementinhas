import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const commonResponses = {
  NotFound: {
    description: 'Registro não encontrado.',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },
  ValidationError: {
    description: 'Dados inválidos.',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },
};

const crudPaths = (
  tag: string,
  schemaName: string,
  path: string,
  description: string,
) => ({
  [path]: {
    get: {
      tags: [tag],
      summary: `Listar ${description}`,
      responses: {
        200: {
          description: 'Lista retornada com sucesso.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: `#/components/schemas/${schemaName}` },
              },
            },
          },
        },
      },
    },
    post: {
      tags: [tag],
      summary: `Criar ${description}`,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${schemaName}Input` },
          },
        },
      },
      responses: {
        201: {
          description: 'Registro criado com sucesso.',
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${schemaName}` },
            },
          },
        },
        400: commonResponses.ValidationError,
      },
    },
  },
  [`${path}/{id}`]: {
    get: {
      tags: [tag],
      summary: `Buscar ${description} por ID`,
      parameters: [{ $ref: '#/components/parameters/IdParam' }],
      responses: {
        200: {
          description: 'Registro encontrado.',
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${schemaName}` },
            },
          },
        },
        404: commonResponses.NotFound,
      },
    },
    put: {
      tags: [tag],
      summary: `Atualizar ${description}`,
      parameters: [{ $ref: '#/components/parameters/IdParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${schemaName}Update` },
          },
        },
      },
      responses: {
        200: {
          description: 'Registro atualizado com sucesso.',
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${schemaName}` },
            },
          },
        },
        400: commonResponses.ValidationError,
        404: commonResponses.NotFound,
      },
    },
    delete: {
      tags: [tag],
      summary: `Remover ${description}`,
      parameters: [{ $ref: '#/components/parameters/IdParam' }],
      responses: {
        204: { description: 'Registro removido com sucesso.' },
        404: commonResponses.NotFound,
      },
    },
  },
});

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Creche Sementinhas',
      version: '1.0.0',
      description: 'Documentação das rotas REST do sistema de gestão da Creche Sementinhas.',
    },
    servers: [
      {
        url: '/',
        description: 'Mesmo host onde a API estiver publicada',
      },
      {
        url: 'http://localhost:3000',
        description: 'Ambiente local',
      },
    ],
    tags: [
      { name: 'Turmas' },
      { name: 'Funcionários' },
      { name: 'Alunos' },
      { name: 'Responsáveis' },
      { name: 'Matrículas' },
      { name: 'Arquivos' },
      { name: 'Responsáveis Transporte' },
      { name: 'Contatos Emergência' },
    ],
    components: {
      parameters: {
        IdParam: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer', example: 1 },
          description: 'ID do registro.',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Dados inválidos' },
            message: { type: 'string', example: 'Registro não encontrado' },
          },
        },
        Turma: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Maternal 1' },
            idade_min: { type: 'integer', example: 2 },
            idade_max: { type: 'integer', example: 3 },
            capacidade: { type: 'integer', example: 20 },
            valor_mensal: { type: 'number', example: 850 },
            periodo: { type: 'string', enum: ['manhã', 'tarde', 'integral'], example: 'integral' },
          },
        },
        TurmaInput: {
          type: 'object',
          required: ['nome', 'idade_min', 'idade_max', 'capacidade', 'valor_mensal', 'periodo'],
          properties: {
            nome: { type: 'string', example: 'Maternal 1' },
            idade_min: { type: 'integer', example: 2 },
            idade_max: { type: 'integer', example: 3 },
            capacidade: { type: 'integer', example: 20 },
            valor_mensal: { type: 'number', example: 850 },
            periodo: { type: 'string', enum: ['manhã', 'tarde', 'integral'], example: 'integral' },
          },
        },
        TurmaUpdate: {
          allOf: [{ $ref: '#/components/schemas/TurmaInput' }],
        },
        Funcionario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Maria Souza' },
            email: { type: 'string', example: 'maria@creche.com' },
            senha: { type: 'string', example: 'senha123' },
          },
        },
        FuncionarioInput: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'Maria Souza' },
            email: { type: 'string', example: 'maria@creche.com' },
            senha: { type: 'string', example: 'senha123' },
          },
        },
        FuncionarioUpdate: {
          allOf: [{ $ref: '#/components/schemas/FuncionarioInput' }],
        },
        Aluno: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'João Silva' },
            data_nasc: { type: 'string', example: '2022-05-10' },
            cpf: { type: 'string', example: '12345678901' },
            andarilha: { type: 'integer', example: 0 },
            autorizacao_img: { type: 'string', nullable: true, example: null },
            sexo: { type: 'string', enum: ['Masculino', 'Feminino'], example: 'Masculino' },
            receita_antitermico: { type: 'string', nullable: true, example: null },
            cirurgia_qual: { type: 'string', nullable: true, example: null },
            cirurgia_tempo: { type: 'string', nullable: true, example: null },
            observacoes: { type: 'string', nullable: true, example: null },
            foto: { type: 'string', nullable: true, example: null },
            problema_saude: { type: 'integer', example: 0 },
            problema_saude_qual: { type: 'string', nullable: true, example: null },
            alergia: { type: 'integer', example: 0 },
            alergia_qual: { type: 'string', nullable: true, example: null },
            medicacao_continua: { type: 'integer', example: 0 },
            medicacao_qual: { type: 'string', nullable: true, example: null },
            medicacao_tempo: { type: 'string', nullable: true, example: null },
            fratura: { type: 'integer', example: 0 },
            fratura_qual: { type: 'string', nullable: true, example: null },
            fratura_tempo: { type: 'string', nullable: true, example: null },
            mamadeira: { type: 'integer', example: 0 },
            formula_qual: { type: 'string', nullable: true, example: null },
            formula_quantidade_ml: { type: 'string', nullable: true, example: null },
            chupeta: { type: 'integer', example: 0 },
            fralda: { type: 'integer', example: 0 },
            restricao_alimentar: { type: 'integer', example: 0 },
            restricao_descricao: { type: 'string', nullable: true, example: null },
            cep: { type: 'string', nullable: true, example: '12345678' },
            endereco: { type: 'string', nullable: true, example: 'Rua das Flores, 100' },
            bairro: { type: 'string', nullable: true, example: 'Centro' },
            complemento: { type: 'string', nullable: true, example: 'Casa' },
            turma_id: { type: 'integer', example: 1 },
            funcionario_id: { type: 'integer', example: 1 },
          },
        },
        AlunoInput: {
          allOf: [{ $ref: '#/components/schemas/Aluno' }],
        },
        AlunoUpdate: {
          allOf: [{ $ref: '#/components/schemas/AlunoInput' }],
        },
        Responsavel: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Ana Silva' },
            cpf: { type: 'string', example: '12345678901' },
            cep: { type: 'string', example: '12345678' },
            parentesco: { type: 'string', example: 'Mãe' },
            profissao: { type: 'string', nullable: true, example: 'Professora' },
            responsavel_finance: { type: 'integer', example: 1 },
          },
        },
        ResponsavelInput: {
          type: 'object',
          required: ['nome', 'cpf', 'cep', 'parentesco', 'responsavel_finance'],
          properties: {
            nome: { type: 'string', example: 'Ana Silva' },
            cpf: { type: 'string', example: '12345678901' },
            cep: { type: 'string', example: '12345678' },
            parentesco: { type: 'string', example: 'Mãe' },
            profissao: { type: 'string', nullable: true, example: 'Professora' },
            responsavel_finance: { type: 'integer', example: 1 },
          },
        },
        ResponsavelUpdate: {
          allOf: [{ $ref: '#/components/schemas/ResponsavelInput' }],
        },
        Matricula: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            plano: { type: 'string', example: 'Integral' },
            valor_mensalidade: { type: 'number', example: 850 },
            data_venc: { type: 'integer', example: 10 },
            inicio_vigencia: { type: 'string', example: '2026-01-01' },
            fim_vigencia: { type: 'string', example: '2026-12-31' },
            forma_pagamento: { type: 'string', example: 'PIX' },
            data_saida: { type: 'string', nullable: true, example: null },
            aluno_id: { type: 'integer', example: 1 },
          },
        },
        MatriculaInput: {
          type: 'object',
          required: ['plano', 'valor_mensalidade', 'data_venc', 'inicio_vigencia', 'fim_vigencia', 'forma_pagamento', 'aluno_id'],
          properties: {
            plano: { type: 'string', example: 'Integral' },
            valor_mensalidade: { type: 'number', example: 850 },
            data_venc: { type: 'integer', example: 10 },
            inicio_vigencia: { type: 'string', example: '2026-01-01' },
            fim_vigencia: { type: 'string', example: '2026-12-31' },
            forma_pagamento: { type: 'string', example: 'PIX' },
            data_saida: { type: 'string', nullable: true, example: null },
            aluno_id: { type: 'integer', example: 1 },
          },
        },
        MatriculaUpdate: {
          allOf: [{ $ref: '#/components/schemas/MatriculaInput' }],
        },
        Arquivo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            caminho_arquivo: { type: 'string', example: 'uploads/foto.jpg' },
            tipo_arquivo: { type: 'string', example: 'foto' },
            data_upload: { type: 'string', example: '2026-06-08 20:00:00' },
            aluno_id: { type: 'integer', example: 1 },
          },
        },
        ArquivoInput: {
          type: 'object',
          required: ['caminho_arquivo', 'tipo_arquivo', 'aluno_id'],
          properties: {
            caminho_arquivo: { type: 'string', example: 'uploads/foto.jpg' },
            tipo_arquivo: { type: 'string', example: 'foto' },
            aluno_id: { type: 'integer', example: 1 },
          },
        },
        ArquivoUpdate: {
          allOf: [{ $ref: '#/components/schemas/ArquivoInput' }],
        },
        ResponsavelTransporte: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Carlos Lima' },
            rg: { type: 'string', example: '123456789' },
            parentesco: { type: 'string', example: 'Tio' },
          },
        },
        ResponsavelTransporteInput: {
          type: 'object',
          required: ['nome', 'rg', 'parentesco'],
          properties: {
            nome: { type: 'string', example: 'Carlos Lima' },
            rg: { type: 'string', example: '123456789' },
            parentesco: { type: 'string', example: 'Tio' },
          },
        },
        ResponsavelTransporteUpdate: {
          allOf: [{ $ref: '#/components/schemas/ResponsavelTransporteInput' }],
        },
        ContatoEmergencia: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Paula Lima' },
            rg: { type: 'string', example: '987654321' },
            parentesco: { type: 'string', example: 'Avó' },
          },
        },
        ContatoEmergenciaInput: {
          type: 'object',
          required: ['nome', 'rg', 'parentesco'],
          properties: {
            nome: { type: 'string', example: 'Paula Lima' },
            rg: { type: 'string', example: '987654321' },
            parentesco: { type: 'string', example: 'Avó' },
          },
        },
        ContatoEmergenciaUpdate: {
          allOf: [{ $ref: '#/components/schemas/ContatoEmergenciaInput' }],
        },
      },
    },
    paths: {
      ...crudPaths('Turmas', 'Turma', '/turmas', 'turmas'),
      ...crudPaths('Funcionários', 'Funcionario', '/funcionarios', 'funcionários'),
      ...crudPaths('Alunos', 'Aluno', '/alunos', 'alunos'),
      ...crudPaths('Responsáveis', 'Responsavel', '/responsaveis', 'responsáveis'),
      ...crudPaths('Matrículas', 'Matricula', '/matriculas', 'matrículas'),
      ...crudPaths('Arquivos', 'Arquivo', '/arquivos', 'arquivos'),
      ...crudPaths('Responsáveis Transporte', 'ResponsavelTransporte', '/responsaveis-transporte', 'responsáveis por transporte'),
      ...crudPaths('Contatos Emergência', 'ContatoEmergencia', '/contatos-emergencia', 'contatos de emergência'),
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
