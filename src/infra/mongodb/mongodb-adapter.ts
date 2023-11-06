import { type NewAccountRepository } from '@/data/protocols'
import { type AccountModel, type NewAccountModel } from '@/domain/protocols'
import { MongoConnection } from './mongodb-connection'

export class MongoDbAdapter implements NewAccountRepository {
  async new (newAccount: NewAccountModel): Promise<AccountModel> {
    const accountCollection = MongoConnection.getCollection('accounts')
    await accountCollection.insertOne(newAccount)
    const account = Object.assign({}, newAccount)
    return MongoConnection.map(account)
  }
}
