export interface Responsavel {
    id: number;
    nome: string;
    cpf: string;
    cep: string;
    parentesco: string;
    profissao: string | null;
    responsavel_finance: number; // 0 ou 1
}

export type CreateResponsavelInput = Omit<Responsavel, 'id'>;
export type UpdateResponsavelInput = Partial<CreateResponsavelInput>;