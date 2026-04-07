import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "src/prisma.service";
import { GoogleCalendarService } from "./google-calendar.service";

@Injectable()
export class GoogleCalendarCron {
  private readonly logger = new Logger(GoogleCalendarCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly calendarService: GoogleCalendarService,
  ) {}

  @Cron("*/10 * * * *")
  async handleCron() {
    this.logger.log("Rodando verificação de webhooks...");

    const watches = await this.prisma.googleWatch.findMany();
    const now = new Date();

    for (const watch of watches) {
      const faltaPouco =
        watch.expiration.getTime() - now.getTime() < 10 * 60 * 1000;

      if (!faltaPouco) continue;

      this.logger.log(`Renovando webhook do user ${watch.userId}`);

      await this.calendarService.watchCalendar(watch.userId);
    }
  }
}
