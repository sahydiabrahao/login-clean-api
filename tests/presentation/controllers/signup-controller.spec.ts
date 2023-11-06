import { type EmailValidator } from '@/domain/usecases/email-validator'
import { SignupController } from '@/presentation/controllers/signup-controller'
import { InternalServerError, InvalidParamError, MissingParamError } from '@/presentation/errors/errors'
import { badRequest, internalServerError, ok } from '@/presentation/http-status-code/http-status-code'
import { type HttpRequest } from '../protocols'
import { type NewAccount } from '@/domain/usecases/new-account'
import { type AccountModel, type NewAccountModel } from '@/domain/protocols'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSpy implements EmailValidator {
    validate (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorSpy()
}

const makeNewAccount = (): NewAccount => {
  class NewAccountSpy implements NewAccount {
    async new (NewAccount: NewAccountModel): Promise<AccountModel> {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
  }
  return new NewAccountSpy()
}

type SutTypes = {
  sut: SignupController
  emailValidatorSpy: EmailValidator
  newAccountSpy: NewAccount
}

const makeSut = (): SutTypes => {
  const newAccountSpy = makeNewAccount()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new SignupController(emailValidatorSpy, newAccountSpy)

  return {
    sut,
    emailValidatorSpy,
    newAccountSpy
  }
}

describe('SignUpController', () => {
  test('Return 400 if name is empty', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Return 400 if email is empty', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Return 400 if password is empty', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Return 400 if passwordConfirmation is empty', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Return 400 if password confirmation does not match password', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorSpy, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('Return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'validate').mockImplementationOnce(() => false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Return 500 if EmailValidator throws an exception', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalServerError(new InternalServerError('any_error')))
  })

  test('Call NewAccount with correct name, email, and password', async () => {
    const { sut, newAccountSpy } = makeSut()
    const newSpy = jest.spyOn(newAccountSpy, 'new')
    await sut.handle(makeFakeRequest())
    expect(newSpy).toHaveBeenCalledWith(
      {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    )
  })

  test('Return 500 if NewAccount throws an exception', async () => {
    const { sut, newAccountSpy } = makeSut()
    jest.spyOn(newAccountSpy, 'new').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalServerError(new InternalServerError('any_error')))
  })

  test('Return 200 and new account on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(
      {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    ))
  })
})
