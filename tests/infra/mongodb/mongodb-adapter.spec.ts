import { MongoConnection } from '@/infra/mongodb/mongodb-connection'
import { MongoDbAdapter } from '@/infra/mongodb/mongodb-adapter'

describe('MongoDbAdapter', () => {
  beforeAll(async () => {
    await MongoConnection.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoConnection.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoConnection.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const sut = new MongoDbAdapter()
    const account = await sut.new({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
