import { type AccountModel, type NewAccountModel } from '@/domain/protocols'

export interface NewAccountRepository {
  new: (newAccount: NewAccountModel) => Promise<AccountModel>
}
