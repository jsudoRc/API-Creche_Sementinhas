type StatusFuncionario = 'ATIVO' | 'INATIVO';

export interface CreateFuncionarioInput {
  nome: string;
  email: string;
  senha: string;
}

export interface Funcionario {
     id: number;
     nome:string;
     email:string;
     senha:string;
     createdAt: Date;
     updatedAt: Date;
     status: StatusFuncionario;

}

export type UpdateFuncionarioInput = Partial<CreateFuncionarioInput>;