import { type ICreateAccount } from '@/domain/i-create-account'
import { type IController, type HttpRequest, type HttpResponse } from '@/presentation/protocols'
import { type IValidation } from '@/utils/i-validation'

export class SignUpController implements IController {
  constructor (
    private readonly createAccount: ICreateAccount,
    private readonly validation: IValidation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body

      this.validation.validate({ name, email, password })

      const account = await this.createAccount.create({ name, email, password })
      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: ''
      }
    }
  }
}
