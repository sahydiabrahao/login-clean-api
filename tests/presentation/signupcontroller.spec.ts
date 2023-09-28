import { type IAccountModel, type ICreateAccount } from '@/domain/i-create-account'
import { SignUpController } from '@/presentation/signup-controller'
import { type HttpRequest, type HttpResponse } from './protocols'
import { type IValidation } from '@/utils/i-validation'

const makeCreateAccountSpy = (): ICreateAccount => {
  class CreateAccountSpy implements ICreateAccount {
    async create (account: IAccountModel): Promise<any> {
      return new Promise(resolve => {
        resolve({
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password'
        })
      })
    }
  }
  return new CreateAccountSpy()
}
const makeValidationSpy = (): IValidation => {
  class ValidationSpy implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationSpy()
}

type SutTypes = {
  sut: SignUpController
  createAccountSpy: ICreateAccount
  validationSpy: IValidation
}

const makeSut = (): SutTypes => {
  const validationSpy = makeValidationSpy()
  const createAccountSpy = makeCreateAccountSpy()
  const sut = new SignUpController(createAccountSpy, validationSpy)
  return {
    sut,
    createAccountSpy,
    validationSpy

  }
}

describe('SignUp Controller', () => {
  test('Must call createAccount with correct values',async () => {
    const { sut, createAccountSpy } = makeSut()
    const createSpy = jest.spyOn(createAccountSpy, 'create')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    await sut.handle(httpRequest)
    expect(createSpy).toHaveBeenCalledWith(
      {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    )
  })

  test('Must return 500 if createAccount fails',async () => {
    const { sut, createAccountSpy } = makeSut()
    jest.spyOn(createAccountSpy, 'create').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })

  test('Must call validation with correct values',async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_passwordConfirmation'
    })
  })

  test('Must return 400 if validation fails',async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new Error())
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse.statusCode).toEqual(400)
  })

  test('Must return 200 and account with ID on success',async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_passwordConfirmation'
      }
    }
    const httpReponse = await sut.handle(httpRequest)
    expect(httpReponse).toEqual({
      statusCode: 200,
      body: {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    )
  })
})
