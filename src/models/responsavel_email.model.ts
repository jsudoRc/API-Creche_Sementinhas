export interface ResponsavelEmail {
    id: number;
    email: string;
    responsavel_id: number;
}

export type CreateResponsavelEmailInput = Omit<ResponsavelEmail, 'id'>;
export type UpdateResponsavelEmailInput = Partial<CreateResponsavelEmailInput>;