import { type ICreateAccount } from '@/domain/i-create-account'
import { type IController, type HttpRequest, type HttpResponse } from '@/presentation/protocols'

export class SignUpController implements IController {
  constructor (private readonly createAccount: ICreateAccount) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body
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
