import { type AccountModel, type NewAccountModel } from '@/domain/protocols'

export interface NewAccount {
  new: (newAccount: NewAccountModel) => Promise<AccountModel>
}
