import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MailConsumer } from './mail.consumer'
import { MailService } from './mail.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'mail_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [MailService, ConfigService],
  exports: [MailService, ClientsModule],
  controllers: [MailConsumer],
})
export class MailModule {}
