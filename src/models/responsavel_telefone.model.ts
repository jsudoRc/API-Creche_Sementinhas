export interface ResponsavelTelefone {
    id: number;
    telefone: string;
    responsavel_id: number;
}

export type CreateResponsavelTelefoneInput = Omit<ResponsavelTelefone, 'id'>;
export type UpdateResponsavelTelefoneInput = Partial<CreateResponsavelTelefoneInput>;