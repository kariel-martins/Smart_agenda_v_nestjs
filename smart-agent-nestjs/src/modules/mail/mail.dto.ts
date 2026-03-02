export class EmailParamsDTO {
  email: string
  subject: string
}

export class EmailForgotAndResetPasswordDTO {
  UserName: string
  token?: string
  pathRoute: string
  EmailDate: EmailParamsDTO
}
