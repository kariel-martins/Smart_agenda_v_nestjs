import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RequestContextService } from "src/common/services/request-context/request-context.service";
import { PrismaService } from "src/prisma.service";
import { GoogleCalendarController } from "./google-calendar.controller";
import { GoogleCalendarService } from "./google-calendar.service";

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [GoogleCalendarController],
  providers: [
    GoogleCalendarService,
    PrismaService,
    RequestContextService,
    ConfigService,
  ],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
