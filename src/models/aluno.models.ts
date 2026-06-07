export interface Aluno {
    id:number;
    nome:string;
    data_nasc:string;
    andarilha:number;
    autorizacao_img:number;
    sexo:string |null;
    receita_antitermico:string|null;
    cirurgia_qual:string |null;
    cirurgia_tempo:string |null;
    observacoes: string | null;

    turma_id:number;
    funcionario_id:number;

}

export type CreateAlunoInput = Omit<Aluno,'id'>;
export type UpdateAlunoInput = Partial<CreateAlunoInput>;