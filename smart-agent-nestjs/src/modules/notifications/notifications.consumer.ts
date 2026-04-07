import { Body, Controller, Post, Res } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { Response } from "express";
import { SEND_WHATSAPP_NOTIFICATION } from "src/consts";
import { InsertWhatsAppRequest } from "./dtos/send-notification.dto";
import { NotificationsService } from "./notifications.service";
import { shortVersion } from "./templetes/whatsapp.templete";

@Controller({
  version: "1",
  path: "notifications",
})
export class NotificationsConsumer {
  constructor(private readonly notificationService: NotificationsService) {}
  @Post("whatsapp")
  async handleMessage(@Body() body: any, @Res() res: Response) {
    console.log("Payload Z-API recebido:", JSON.stringify(body));

    const incomingMessage = body.body?.trim().toLowerCase();
    const from = body.phone;

    if (!incomingMessage || !from) {
      return res.status(200).json({ status: "ignored" });
    }

    console.log("Mensagem recebida:", incomingMessage);
    console.log("De:", from);

    let reply = "Não entendi sua mensagem.";

    if (incomingMessage === "confirm") {
      reply = "✅ Agendamento confirmado com sucesso!";
    }

    if (incomingMessage === "cancel") {
      reply = "❌ Agendamento cancelado.";
    }

    await this.notificationService.sendWhatsapp({
      to: from,
      message: reply,
    });

    return res.status(200).json({ status: "ok" });
  }

  @EventPattern(SEND_WHATSAPP_NOTIFICATION)
  async handleNotification(@Payload() payload: InsertWhatsAppRequest) {
    console.log(payload);
    if (payload.type === "whatsapp") {
      switch (payload.action) {
        case "create":
          await this.notificationService.sendWhatsapp({
            to: payload.to,
            message: shortVersion(payload.data.appointmentId),
          });
          break;
      }
    }

    if (payload.type === "email") {
      switch (payload.action) {
        case "create-account":
          await this.notificationService.sendCreateAccountMail({
            pathRoute: payload.data.pathRoute,
            EmailDate: {
              email: payload.data.email,
              subject: payload.data.subject,
            },
            UserName: payload.data.email,
          });
          break;

        case "forgot-password":
          await this.notificationService.sendForgotPassword({
            pathRoute: payload.data.pathRoute,
            EmailDate: {
              email: payload.data.email,
              subject: payload.data.subject,
            },
            UserName: payload.data.email,
          });
          break;

        case "reset-password":
          await this.notificationService.sendCreateAccountMail({
            pathRoute: payload.data.pathRoute,
            EmailDate: {
              email: payload.data.email,
              subject: payload.data.subject,
            },
            UserName: payload.data.email,
          });
          break;
      }
    }
  }
}
