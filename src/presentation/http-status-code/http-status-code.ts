import { type HttpResponse } from '@/presentation/protocols'
import { InternalServerError, UnauthorizedError } from '../errors/errors'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const internalServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(error.stack)
})
