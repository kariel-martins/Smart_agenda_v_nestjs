import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "src/common/guards/jwt-auth/jwt-auth.guard";
import { CreateEventDTO } from "./dtos/google-calendar.dto";
import { GoogleCalendarService } from "./google-calendar.service";

@ApiTags("Google Calendar")
@Controller({ version: "1", path: "google-calendar" })
@UseGuards(JwtAuthGuard)
export class GoogleCalendarController {
  constructor(
    private readonly calendarService: GoogleCalendarService,
    private readonly confingService: ConfigService,
  ) {}

  @Get("connect")
  connect(@Res() res: Response) {
    const url = this.calendarService.getAuthUrl();
    return res.redirect(url);
  }

  @Get("auth-url")
  getAuthUrl() {
    return { url: this.calendarService.getAuthUrl() };
  }

  @Get("status")
  @ApiOkResponse({ description: "Status da conexão com Google Calendar" })
  async status() {
    return this.calendarService.getStatus();
  }

  @Get("callback")
  @UseGuards()
  async callback(
    @Query("code") code: string,
    @Query("state") userId: string,
    @Res() res: Response,
  ) {
    try {
      await this.calendarService.handleCallback(code, userId);

      return res.redirect(
        `${this.confingService.get("FRONT_END_URL")}/settings/calendar?connected=true`,
      );
    } catch (error: any) {
      return res.redirect(
        `${this.confingService.get("FRONT_END_URL")}/settings/calendar?connected=false&error=access_denied`,
      );
    }
  }

  @Get("events")
  @ApiOkResponse({ description: "Lista de eventos do Google Calendar" })
  async listEvents() {
    return this.calendarService.listEvents();
  }

  @Post("events")
  async createEvent(@Body() data: CreateEventDTO) {
    function formatDateTime(dateTime: string) {
      return `${dateTime}:00-03:00`;
    }
    return this.calendarService.createEvent({
      summary: data.title,
      description: data.description,
      start: {
        dateTime: formatDateTime(data.startDateTime),
        timeZone: data.timeZone,
      },
      end: {
        dateTime: formatDateTime(data.endDateTime),
        timeZone: data.timeZone,
      },
    });
  }

  @Delete("events/:eventId")
  async deleteEvent(@Param("eventId") eventId: string) {
    await this.calendarService.deleteEvent(eventId);
    return { message: "Evento removido com sucesso!" };
  }

  @Delete("disconnect")
  async disconnect() {
    await this.calendarService.disconnectGoogle();
    return { message: "Google Calendar desconectado!" };
  }
}
