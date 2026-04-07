import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RequestContextService } from "src/common/services/request-context/request-context.service";
import { PrismaService } from "src/prisma.service";
import { NotificationGatewayGateway } from "../../common/gateway/notification-gateway/notification-gateway.gateway";
import { GoogleCalendarController } from "./google-calendar.controller";
import { GoogleCalendarCron } from "./google-calendar.cron";
import { GoogleCalendarService } from "./google-calendar.service";

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [GoogleCalendarController],
  providers: [
    GoogleCalendarCron,
    GoogleCalendarService,
    PrismaService,
    NotificationGatewayGateway,
    RequestContextService,
    ConfigService,
  ],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
