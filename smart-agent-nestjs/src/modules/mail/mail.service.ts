import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { EmailForgotAndResetPasswordDTO, EmailParamsDTO } from './mail.dto'
import { createAccount, forgotPassword, resentPassword } from './mail.template'

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  private async sendMail(emailData: EmailParamsDTO, template: string) {
    const resend = new Resend(this.configService.get<string>('SECRET_RESEND'))

    const { data, error } = await resend.emails.send({
      from: 'Smart Agenda <onboarding@mundodev.shop>',
      to: [emailData.email],
      subject: emailData.subject,
      html: template,
    })

    if (error) {
      console.error({ error })
      throw new InternalServerErrorException('Falha ao enviar email')
    }

    console.log({ data })
  }

  async sendCreateAccount(pathRoute: string, data: EmailParamsDTO) {
    const url = `${this.configService.get<string>('APP_BASE_URL')}${pathRoute}`
    const template = createAccount(url)
    await this.sendMail(data, template)
  }

  async sendForgotPassword(data: EmailForgotAndResetPasswordDTO) {
    const url = `${this.configService.get<string>('APP_BASE_URL')}${data.pathRoute}?token=${data.token}`
    const template = forgotPassword(url, data.UserName)
    await this.sendMail(data.EmailDate, template)
  }

  async sendResetPassword(data: EmailForgotAndResetPasswordDTO) {
    const url = `${this.configService.get<string>('APP_BASE_URL')}${data.pathRoute}`
    const template = resentPassword(url, data.UserName)
    await this.sendMail(data.EmailDate, template)
  }
}