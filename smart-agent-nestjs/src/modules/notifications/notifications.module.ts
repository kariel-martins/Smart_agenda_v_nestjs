import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import {
  EMAIL_QUEUE,
  EMAIL_SERVICE,
  NOTIFICATIONS_QUEUE,
  NOTIFICATIONS_SERVICE,
} from "src/consts";
import { NotificationsConsumer } from "./notifications.consumer";
import { NotificationsService } from "./notifications.service";
import { MailProvider } from "./providers/email.provider";
import { WhatsappProvider } from "./providers/whatsapp.provider";

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: () => {
          const url = process.env.RABBITMQ_URL;

          if (!url) throw new Error("RABBITMQ_URL não definida");

          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: NOTIFICATIONS_QUEUE,
              queueOptions: { durable: true },
            },
          };
        },
      },
      {
        name: EMAIL_SERVICE,
        useFactory: () => {
          const url = process.env.RABBITMQ_URL;

          if (!url) throw new Error("RABBITMQ_URL não definida");

          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: EMAIL_QUEUE,
              queueOptions: { durable: true },
            },
          };
        },
      },
    ]),
  ],
  providers: [NotificationsService, WhatsappProvider, MailProvider],
  exports: [ClientsModule],
  controllers: [NotificationsConsumer],
})
export class NotificationsModule {}
