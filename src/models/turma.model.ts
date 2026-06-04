//criando um model para a entidade Turma
export interface Turma {
    id: number;
    nome: string;
    idade_max: number;
    idade_min: number;
    capacidade: number;
    valor_mensal: number;
    periodo: 'manhã' | 'tarde' | 'integral';
}

export type CreateTurmaInput = Omit<Turma, 'id'>;
export type UpdateTurmaInput = Partial<CreateTurmaInput>;