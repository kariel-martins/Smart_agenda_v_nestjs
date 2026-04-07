import { Module } from "@nestjs/common";
import { ExecuteHandler } from "src/common/handlers/execute.handler";
import { RequestContextService } from "src/common/services/request-context/request-context.service";
import { PrismaService } from "src/prisma.service";
import { NoShowHandlerService } from "../no-show-rules/no-show-handler.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";

@Module({
  imports: [NotificationsModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    PrismaService,
    RequestContextService,
    ExecuteHandler,
    NoShowHandlerService,
  ],
})
export class AppointmentModule {}
