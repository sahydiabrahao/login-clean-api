import { type NewAccountModel, type AccountModel } from '@/domain/protocols'
import { type NewAccount } from '@/domain/usecases/new-account'
import { type NewAccountRepository, type Hasher } from '../protocols'

export class DbNewAccount implements NewAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly newAccountRepository: NewAccountRepository
  ) {}

  async new (newAccount: NewAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(newAccount.password)

    const account = await this.newAccountRepository.new(
      (Object.assign({}, newAccount, { password: hashedPassword }))
    )

    return new Promise(resolve => { resolve(account) })
  }
}
