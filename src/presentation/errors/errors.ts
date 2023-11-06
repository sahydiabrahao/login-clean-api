export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = `The ${paramName} parameter is missing.`
  }
}

export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = `The ${paramName} parameter is invalid.`
  }
}
export class InternalServerError extends Error {
  constructor (stack: string) {
    super('Internal server error')
    this.name = 'An internal server error occurred.'
    this.stack = stack
  }
}
export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'You are not authorized to access this resource.'
  }
}
