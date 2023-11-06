import { BcryptAdapter } from '@/infra/bcrypt/bcrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BcryptAdapter', () => {
  test('Call Bcrypt with correct password', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('valid_password')
    expect(hashSpy).toHaveBeenLastCalledWith('valid_password', salt)
  })

  test('Throws an exception if Bcrypt throws an exception', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error('')
    })
    const promise = sut.hash('valid_password')
    await expect(promise).rejects.toThrow()
  })

  test('Return hash on success', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return 'hashed_password'
    })
    const hash = await sut.hash('valid_password')
    expect(hash).toEqual('hashed_password')
  })
})
