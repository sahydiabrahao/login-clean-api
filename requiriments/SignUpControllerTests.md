# UNIT TESTS

## SignUpController

✅Must call createAccount with correct values
✅Must return 500 if createAccount fails
✅Must call validation with correct values
✅Must return 400 if validation fails
Must return 200 on success

## CreateAccoountRepository

Must call hasher with correct values
Must return 500 if hasher fails
Must call createAccountRepository with correct values
Must return 500 if createAccountRepository fails
Must return 200 on success

## CompareValidation

Must return MissingParamError if validation fails
Must not return anything on success

## RequireValidation

Must return MissingParamError if validation fails
Must not return anything on success

## EmailValidation

Must call EmailValidatorAdapter with correct values
Must return 500 if EmailValidatorAdapter fails
Must return error if EmailValidatorAdapter returns false

## ValidationComposite

Must return error if any validation fails
Must return the first error if more than one validation fails
Must not return anything on success

## MongoAdapter

Must return account on success

## BcryptAdapter

Must call Bcrypt with correct values
Must return a valid hash on success
Must return error if Bcrypt fails

## EmailValidatorAdapter

Must call Validator with correct values
Must return false if Validator returns false
Must return true if Validator returns true
