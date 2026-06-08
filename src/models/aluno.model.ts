export interface Aluno {
    id: number;
    nome: string;
    data_nasc: string;
    cpf: string;
    andarilha: number;
    autorizacao_img: string | null;
    sexo: 'Masculino' | 'Feminino';
    receita_antitermico: string | null;
    cirurgia_qual: string | null;
    cirurgia_tempo: string | null;
    observacoes: string | null;
    foto: string | null;
    problema_saude: number;
    problema_saude_qual: string | null;
    alergia: number;
    alergia_qual: string | null;
    medicacao_continua: number;
    medicacao_qual: string | null;
    medicacao_tempo: string | null;
    fratura: number;
    fratura_qual: string | null;
    fratura_tempo: string | null;
    mamadeira: number;
    formula_qual: string | null;
    formula_quantidade_ml: string | null;
    chupeta: number;
    fralda: number;
    restricao_alimentar: number;
    restricao_descricao: string | null;
    cep: string | null;
    endereco: string | null;
    bairro: string | null;
    complemento: string | null;

    turma_id: number;
    funcionario_id: number;
}

export type CreateAlunoInput = Omit<Aluno, 'id'>;
export type UpdateAlunoInput = Partial<CreateAlunoInput>;