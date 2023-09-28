import { type IAccountModel, type ICreateAccount } from '@/domain/i-create-account'
import { SignUpController } from '@/presentation/signup-controller'

const makeCreateAccountSpy = (): ICreateAccount => {
  class CreateAccountSpy implements ICreateAccount {
    async create (account: IAccountModel): Promise<any> {
      return new Promise(resolve => {
        resolve({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
      })
    }
  }
  return new CreateAccountSpy()
}

type SutTypes = {
  sut: SignUpController
  createAccountSpy: ICreateAccount
}

const makeSut = (): SutTypes => {
  const createAccountSpy = makeCreateAccountSpy()
  const sut = new SignUpController(createAccountSpy)
  return {
    sut,
    createAccountSpy
  }
}

describe('SignUp Controller', () => {
  test('Must call createAccount with correct values',async () => {
    const { sut, createAccountSpy } = makeSut()
    const createSpy = jest.spyOn(createAccountSpy, 'create')
    const request = {
      statusCode: 200,
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(request)
    expect(createSpy).toHaveBeenCalledWith(
      {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    )
  })
})
