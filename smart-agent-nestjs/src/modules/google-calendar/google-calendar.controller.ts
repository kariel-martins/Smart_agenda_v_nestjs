import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Request, Response } from "express";
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
  connect(@Res() res: Response, @Req() req: Request) {
    const { id } = req.user as User;
    const url = this.calendarService.getAuthUrl(id);
    return res.redirect(url);
  }

  @Get("auth-url")
  getAuthUrl(@Req() req: Request) {
    const { id } = req.user as User;
    return { url: this.calendarService.getAuthUrl(id) };
  }

  @Get("status")
  @ApiOkResponse({ description: "Status da conexão com Google Calendar" })
  async status(@Req() req: Request) {
    const { id } = req.user as User;
    return this.calendarService.getStatus(id);
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
  async listEvents(@Req() req: Request) {
    const { id } = req.user as User;
    return this.calendarService.listEvents(id);
  }

  @Post("webhook")
  async webhook(@Headers("x-goog-resource-id") resourceId: string) {
    await this.calendarService.handleWebhook(resourceId);
  }

  @Post("events")
  async createEvent(@Body() data: CreateEventDTO, @Req() req: Request) {
    const { id } = req.user as User;
    function formatDateTime(dateTime: string) {
      return `${dateTime}:00-03:00`;
    }
    return this.calendarService.createEvent(
      {
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
      },
      id,
    );
  }

  @Delete("events/:eventId")
  async deleteEvent(@Param("eventId") eventId: string, @Req() req: Request) {
    const { id } = req.user as User;
    await this.calendarService.deleteEvent(eventId, id);
    return { message: "Evento removido com sucesso!" };
  }

  @Delete("disconnect")
  async disconnect(@Req() req: Request) {
    const { id } = req.user as User;
    await this.calendarService.disconnectGoogle(id);
    return { message: "Google Calendar desconectado!" };
  }
}
