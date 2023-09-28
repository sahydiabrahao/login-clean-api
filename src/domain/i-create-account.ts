export interface IAccountModel {
  name: string
  email: string
  password: string
}

export interface IAccount {
  id: string
  name: string
  email: string
  password: string
}

export interface ICreateAccount {
  create: (account: IAccountModel) => Promise<IAccount >
}
