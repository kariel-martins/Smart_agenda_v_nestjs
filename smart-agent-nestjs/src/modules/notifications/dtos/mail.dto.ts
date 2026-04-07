export interface EmailParamsDTO {
  email: string;
  subject: string;
}

export interface EmailForgotAndResetPasswordDTO {
  UserName: string;
  token?: string;
  pathRoute?: string;
  EmailDate: EmailParamsDTO;
}
