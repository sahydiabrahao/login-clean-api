import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { badRequest, internalServerError, ok } from '@/presentation/http-status-code/http-status-code'
import { InternalServerError, InvalidParamError, MissingParamError } from '@/presentation/errors/errors'
import { type EmailValidator } from '@/domain/usecases/email-validator'
import { type NewAccount } from '@/domain/usecases/new-account'

export class SignupController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly newAccount: NewAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const emailValidate = this.emailValidator.validate(email)
      if (!emailValidate) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.newAccount.new({ name, email, password })
      return ok(account)
    } catch (error) {
      return internalServerError(new InternalServerError(error))
    }
  }
}
