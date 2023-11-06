import { type EmailValidator } from '@/domain/usecases/email-validator'
import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  validate (email: string): boolean {
    return validator.isEmail(email)
  }
}
