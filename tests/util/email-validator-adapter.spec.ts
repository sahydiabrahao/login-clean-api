import validator from 'validator'
import { EmailValidatorAdapter } from '@/util/email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  test('Call Validator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.validate('valid_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('Return false if Validator return false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => false)
    const isValid = sut.validate('valid_email@mail.com')
    expect(isValid).toBeFalsy()
  })

  test('Return true if Validator return true', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => true)
    const isValid = sut.validate('valid_email@mail.com')
    expect(isValid).toBeTruthy()
  })
})
