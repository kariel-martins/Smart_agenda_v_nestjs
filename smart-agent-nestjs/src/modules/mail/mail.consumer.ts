import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { SEND_PASSWORD_RESET } from 'src/consts'
import { EmailForgotAndResetPasswordDTO } from './mail.dto'
import { MailService } from './mail.service'

@Controller()
export class MailConsumer {
  constructor(private mailer: MailService) {}

  @EventPattern(SEND_PASSWORD_RESET)
  async handleCreateAccount(
    @Payload() data: { pathRoute: string; data: { email: string; subject: string } },
  ) {
    await this.mailer.sendCreateAccount(data.pathRoute, data.data)
  }

  @EventPattern(SEND_PASSWORD_RESET)
  async handleResetPasswored(@Payload() data: EmailForgotAndResetPasswordDTO) {
    await this.mailer.sendResetPassword(data)
  }
}
