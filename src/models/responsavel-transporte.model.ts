export interface ResponsavelTransporte {
    id: number;
    nome: string;
    rg: string;
    parentesco: string;
}

export type CreateResponsavelTransporteInput = Omit<ResponsavelTransporte, 'id'>;
export type UpdateResponsavelTransporteInput = Partial<CreateResponsavelTransporteInput>;