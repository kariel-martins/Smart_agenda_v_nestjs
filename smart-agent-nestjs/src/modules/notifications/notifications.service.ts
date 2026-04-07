import { Injectable } from "@nestjs/common";
import { EmailForgotAndResetPasswordDTO } from "./dtos/mail.dto";
import { InsertWhatsApp } from "./dtos/send-notification.dto";
import { MailProvider } from "./providers/email.provider";
import { WhatsappProvider } from "./providers/whatsapp.provider";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly whatsappProvider: WhatsappProvider,
    private readonly MailProvider: MailProvider,
  ) {}

  async sendWhatsapp(data: InsertWhatsApp) {
    await this.whatsappProvider.send(data);
  }

  async sendCreateAccountMail(data: EmailForgotAndResetPasswordDTO) {
    await this.MailProvider.sendCreateAccount(data);
  }

  async sendForgotPassword(data: EmailForgotAndResetPasswordDTO) {
    await this.MailProvider.sendForgotPassword(data);
  }

  async sendResetPassword(data: EmailForgotAndResetPasswordDTO) {
    await this.MailProvider.sendResetPassword(data);
  }
}
