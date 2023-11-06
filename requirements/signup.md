## SignUpController

Return 400 if name is empty
Return 400 if email is empty
Return 400 if password is empty
Return 400 if password confirmation is empty
Return 400 if password confirmation does not match password

Call EmailValidator with correct email
Return 400 if invalid email is provided
Return 500 if EmailValidator throws an exception

Call NewAccount with correct name, email, and password
Return 500 if NewAccount throws an exception

Return 200 and new account on success

## EmailValidatorAdapter

Call Validator with correct email
Return false if Validator return false
Return true if Validator return true

## DbNewAccount

Call Hasher with correct password
Throws an exception if Hasher throws an exception

Call NewAccountRepository with correct name, email, password
Throws an exception if NewAccountRepository throws an exception

Return new account on success

## BcryptAdapter

Call Bcrypt with correct password
Throws an exception if Bcrypt throws an exception
Return hash on success

## MongoDbAdapter

Return new account on success
