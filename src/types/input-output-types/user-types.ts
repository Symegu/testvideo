export type LoginInputModel = {
  loginOrEmail: string,
  password: string
}

export type UserInputModel = {
  login: string, //maxLength: 10; minLength: 3; pattern: ^[a-zA-Z0-9_-]*$; must be unique
  password: string, //maxLength: 20; minLength: 6;
  email: string //example: example@example.com; pattern: ^[a-zA-Z0-9_-]*$; must be unique;
}