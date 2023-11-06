import { type NewAccountRepository, type Hasher } from '@/data/protocols'
import { DbNewAccount } from '@/data/usecases/db-new-account'
import { type AccountModel, type NewAccountModel } from '@/domain/protocols'

const makeFakeRequest = (): NewAccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

const makeHasher = (): Hasher => {
  class HasherSpy implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new HasherSpy()
}

const makeNewAccountRepository = (): NewAccountRepository => {
  class NewAccountRepositorySpy implements NewAccountRepository {
    async new (newAccount: NewAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      }
      return new Promise(resolve => { resolve(fakeAccount) })
    }
  }
  return new NewAccountRepositorySpy()
}

type SutTypes = {
  sut: DbNewAccount
  hasherSpy: Hasher
  newAccountRepositorySpy: NewAccountRepository
}

const makeSut = (): SutTypes => {
  const newAccountRepositorySpy = makeNewAccountRepository()
  const hasherSpy = makeHasher()
  const sut = new DbNewAccount(hasherSpy, newAccountRepositorySpy)
  return {
    sut,
    hasherSpy,
    newAccountRepositorySpy
  }
}

describe('DbNewAccount', () => {
  test('Call Hasher with correct password',async () => {
    const { sut, hasherSpy } = makeSut()
    const hashSpy = jest.spyOn(hasherSpy, 'hash')
    await sut.new(makeFakeRequest())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Throws an exception if Hasher throws an exception',async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockReturnValueOnce(new Promise(
      (resolve,reject) => { reject(new Error()) }))
    const promise = sut.new(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Call NewAccountRepository with correct name, email, password',async () => {
    const { sut, newAccountRepositorySpy } = makeSut()
    const hashSpy = jest.spyOn(newAccountRepositorySpy, 'new')
    await sut.new(makeFakeRequest())
    expect(hashSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Throws an exception if NewAccountRepository throws an exception',async () => {
    const { sut, newAccountRepositorySpy } = makeSut()
    jest.spyOn(newAccountRepositorySpy, 'new').mockReturnValueOnce(new Promise(
      (resolve,reject) => { reject(new Error()) }))
    const promise = sut.new(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Return new account on success',async () => {
    const { sut } = makeSut()
    const newAccount = await sut.new(makeFakeRequest())
    expect(newAccount).toEqual(
      {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      }
    )
  })
})
