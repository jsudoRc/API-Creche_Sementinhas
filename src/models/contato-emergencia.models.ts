export interface ContatoEmergencia {
    id: number;
    nome: string;
    rg: string;
    parentesco: string;
}

export type CreateContatoEmergenciaInput = Omit<ContatoEmergencia, 'id'>;
export type UpdateContatoEmergenciaInput = Partial<CreateContatoEmergenciaInput>;