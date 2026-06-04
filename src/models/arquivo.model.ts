export interface Arquivo {
    id: number;
    caminho_arquivo: string;
    tipo_arquivo: string;
    data_upload: string; // Vai vir preenchido do banco quando fizermos o SELECT
    aluno_id: number;
}

// Omitimos 'id' e 'data_upload' porque o banco gera os dois sozinho no momento do INSERT
export type CreateArquivoInput = Omit<Arquivo, 'id' | 'data_upload'>;

export type UpdateArquivoInput = Partial<CreateArquivoInput>;