export interface Matricula {
    id: number;
    plano: string;
    valor_mensalidade: number; // O REAL do banco vira number aqui
    data_venc: number;
    inicio_vigencia: string;
    fim_vigencia: string;
    forma_pagamento: string;
    data_saida: string | null;
    
    aluno_id: number;
}

export type CreateMatriculaInput = Omit<Matricula, 'id'>;
export type UpdateMatriculaInput = Partial<CreateMatriculaInput>;