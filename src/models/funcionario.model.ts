export interface Funcionario {
     id: number;
     nome:string;
     email:string;
     senha:string;

}

export type CreateFuncionarioInput = Omit<Funcionario,'id'>;
export type UpdateFuncionarioInput = Partial<CreateFuncionarioInput>;