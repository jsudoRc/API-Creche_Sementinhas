import axios from 'axios';

// ==========================================
// 1. CONFIGURAÇÃO BASE DO AXIOS
// ==========================================

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim();

if (!API_BASE_URL) {
  throw new Error(
    '[api.ts] VITE_API_URL não definida. Configure a variável em frontend/.env. ' +
    'Veja frontend/.env.example.'
  );
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de resposta: exibe erros de rede de forma centralizada no console
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro retornado pelo servidor (4xx, 5xx)
      console.error(`[API] Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // Requisição feita mas sem resposta (backend offline, CORS, etc.)
      console.error('[API] Sem resposta do servidor. Verifique se o backend está rodando.');
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 2. INTERFACES (Espelho exato dos models do backend)
// ==========================================

export interface Turma {
  id: number;
  nome: string;
  idade_max: number;
  idade_min: number;
  capacidade: number;
  valor_mensal: number;
  periodo: 'manhã' | 'tarde' | 'integral'; // enum igual ao backend
}

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  senha?: string; // opcional no front para não expor o hash acidentalmente
}

// Interface espelho do model Aluno do backend (src/models/aluno.model.ts)
// Todos os 34 campos presentes no banco estão aqui
export interface Aluno {
  id: number;
  nome: string;
  data_nasc: string;
  cpf: string;
  andarilha: number;                       // 0 ou 1 (SQLite não tem boolean)
  autorizacao_img: string | null;          // caminho do arquivo ou null
  sexo: 'Masculino' | 'Feminino';
  receita_antitermico: string | null;      // caminho do arquivo ou null
  cirurgia_qual: string | null;
  cirurgia_tempo: string | null;
  observacoes: string | null;
  foto: string | null;                     // caminho do arquivo ou null
  problema_saude: number;                  // 0 ou 1
  problema_saude_qual: string | null;
  alergia: number;                         // 0 ou 1
  alergia_qual: string | null;
  medicacao_continua: number;              // 0 ou 1
  medicacao_qual: string | null;
  medicacao_tempo: string | null;
  fratura: number;                         // 0 ou 1
  fratura_qual: string | null;
  fratura_tempo: string | null;
  mamadeira: number;                       // 0 ou 1
  formula_qual: string | null;
  formula_quantidade_ml: string | null;
  chupeta: number;                         // 0 ou 1
  fralda: number;                          // 0 ou 1
  restricao_alimentar: number;             // 0 ou 1
  restricao_descricao: string | null;
  cep: string | null;
  endereco: string | null;
  bairro: string | null;
  complemento: string | null;
  turma_id: number;
  funcionario_id: number;
}

export interface Responsavel {
  id: number;
  nome: string;
  cpf: string;
  cep: string;
  parentesco: string;
  profissao: string | null;
  responsavel_finance: number; // 0 ou 1
}

export interface ResponsavelTransporte {
  id: number;
  nome: string;
  rg: string;
  parentesco: string;
}

export interface ContatoEmergencia {
  id: number;
  nome: string;
  rg: string;
  parentesco: string;
}

export interface Matricula {
  id: number;
  plano: string;
  valor_mensalidade: number;
  data_venc: number;
  inicio_vigencia: string;
  fim_vigencia: string;
  forma_pagamento: string;
  data_saida: string | null;
  aluno_id: number;
}

export interface Arquivo {
  id: number;
  caminho_arquivo: string;
  tipo_arquivo: string;
  data_upload: string; // gerado automaticamente pelo banco
  aluno_id: number;
}

// ==========================================
// 3. FUNÇÃO GENÉRICA DE CRUD
// ==========================================
function createCrudService<T, TCreate = Omit<T, 'id'>>(resource: string) {
  return {
    getAll: () => api.get<T[]>(`/${resource}`),
    getById: (id: number) => api.get<T>(`/${resource}/${id}`),
    create: (data: TCreate) => api.post<T>(`/${resource}`, data),
    update: (id: number, data: Partial<TCreate>) => api.put<T>(`/${resource}/${id}`, data),
    delete: (id: number) => api.delete<void>(`/${resource}/${id}`),
  };
}

// ==========================================
// 4. SERVIÇOS EXPORTADOS (um por rota da API)
// ==========================================
export const TurmaService = createCrudService<Turma>('turmas');
export const FuncionarioService = createCrudService<Funcionario>('funcionarios');
export const AuthService = {
  login: (email: string, senha: string) => api.post<Omit<Funcionario, 'senha'>>('/funcionarios/login', { email, senha }),
};
export const AlunoService = createCrudService<Aluno>('alunos');
export const ResponsavelService = createCrudService<Responsavel>('responsaveis');
export const MatriculaService = createCrudService<Matricula>('matriculas');
export const ResponsavelTransporteService = createCrudService<ResponsavelTransporte>('responsaveis-transporte');
export const ContatoEmergenciaService = createCrudService<ContatoEmergencia>('contatos-emergencia');

// Serviço de Arquivos com método extra para upload multipart/form-data
export const ArquivoService = {
  ...createCrudService<Arquivo>('arquivos'),

  // Usado ao enviar foto, autorizacao_img ou receita_antitermico via formulário
  upload: (alunoId: number, file: File, campo: 'foto' | 'autorizacao_img' | 'receita_antitermico') => {
    const formData = new FormData();
    formData.append(campo, file); // nome do campo deve bater com o upload.fields() do multer no backend
    formData.append('aluno_id', String(alunoId));

    return api.post<Arquivo>('/arquivos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
