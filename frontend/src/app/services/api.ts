import axios from 'axios';

// ==========================================
// 1. CONFIGURAÇÃO BASE DO AXIOS
// ==========================================
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opcional: Interceptor para adicionar Token de Autenticação nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ajuste conforme sua estratégia de auth
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 2. INTERFACES (Baseadas no seu banco de dados)
// ==========================================
export interface Turma {
  id: number;
  nome: string;
  idade_max: number;
  idade_min: number;
  capacidade: number;
  valor_mensal: number;
  periodo: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  senha?: string; // Opcional no front para não expor acidentalmente
}

export interface Aluno {
  id: number;
  nome: string;
  data_nasc: string;
  andarilha: number;
  autorizacao_img: number;
  sexo: string | null;
  receita_antitermico: string | null;
  cirurgia_qual: string | null;
  cirurgia_tempo: string | null;
  observacoes: string | null;
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
  responsavel_finance: number;
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
  data_upload: string;
  aluno_id: number;
}

// ==========================================
// 3. FUNÇÃO GENÉRICA DE CRUD
// ==========================================
// Esta função cria todos os verbos HTTP padrão para qualquer rota
function createCrudService<T>(resource: string) {
  return {
    getAll: () => api.get<T[]>(`/${resource}`),
    getById: (id: number) => api.get<T>(`/${resource}/${id}`),
    create: (data: Omit<T, 'id'>) => api.post<T>(`/${resource}`, data),
    update: (id: number, data: Partial<T>) => api.put<T>(`/${resource}/${id}`, data),
    delete: (id: number) => api.delete(`/${resource}/${id}`),
  };
}

// ==========================================
// 4. SERVIÇOS EXPORTADOS (Endpoints)
// ==========================================
export const TurmaService = createCrudService<Turma>('turmas');
export const FuncionarioService = createCrudService<Funcionario>('funcionarios');
export const AlunoService = createCrudService<Aluno>('alunos');
export const ResponsavelService = createCrudService<Responsavel>('responsaveis');
export const MatriculaService = createCrudService<Matricula>('matriculas');
export const ResponsavelTransporteService = createCrudService<ResponsavelTransporte>('responsaveis-transporte');
export const ContatoEmergenciaService = createCrudService<ContatoEmergencia>('contatos-emergencia');

// Serviço de Arquivos (Com método extra para upload de arquivos reais)
export const ArquivoService = {
  ...createCrudService<Arquivo>('arquivos'),
  
  // Método específico para upload usando multipart/form-data
  upload: (alunoId: number, file: File) => {
    const formData = new FormData();
    formData.append('arquivo', file); // O nome do campo deve bater com o que o multer (ou similar) espera no Node
    formData.append('aluno_id', String(alunoId));

    return api.post<Arquivo>('/arquivos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};