import { randomUUID } from "node:crypto";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { calendar_v3, google } from "googleapis";
import { PrismaService } from "src/prisma.service";
import { NotificationGatewayGateway } from "../../common/gateway/notification-gateway/notification-gateway.gateway";

@Injectable()
export class GoogleCalendarService {
  private readonly oauth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly notificationGateway: NotificationGatewayGateway,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.config.get("GOOGLE_CLIENT_ID"),
      this.config.get("GOOGLE_CLIENT_SECRET"),
      this.config.get("GOOGLE_CALLBACK_URL"),
    );
  }

  getAuthUrl(userId: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      state: userId,
    });
  }

  async handleCallback(code: string, userId: string) {
    const client = new google.auth.OAuth2(
      this.config.get("GOOGLE_CLIENT_ID"),
      this.config.get("GOOGLE_CLIENT_SECRET"),
      this.config.get("GOOGLE_CALLBACK_URL"),
    );

    const { tokens } = await client.getToken(code);

    if (!tokens.access_token) {
      throw new UnauthorizedException("Token inválido");
    }

    await this.prisma.googleToken.upsert({
      where: { userId },
      create: {
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? "",
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600 * 1000),
      },
      update: {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600 * 1000),
      },
    });

    await this.watchCalendar(userId);

    return { message: "Conectado com sucesso" };
  }

  private async getClientByUser(userId: string) {
    const token = await this.prisma.googleToken.findUnique({
      where: { userId },
    });

    if (!token) {
      throw new NotFoundException("Google não conectado");
    }

    this.oauth2Client.setCredentials({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
    });

    if (token.expiresAt < new Date()) {
      const { credentials } = await this.oauth2Client.refreshAccessToken();

      await this.prisma.googleToken.update({
        where: { userId },
        data: {
          accessToken: credentials.access_token!,
          expiresAt: new Date(
            credentials.expiry_date ?? Date.now() + 3600 * 1000,
          ),
        },
      });

      this.oauth2Client.setCredentials(credentials);
    }

    return google.calendar({ version: "v3", auth: this.oauth2Client });
  }

  private async getAuthenticatedClient(userId: string) {
    return this.getClientByUser(userId);
  }

  async watchCalendar(userId: string) {
    const calendar = await this.getClientByUser(userId);

    const response = await calendar.events.watch({
      calendarId: "primary",
      requestBody: {
        id: randomUUID(),
        type: "web_hook",
        address: `${this.config.get("BACKEND_URL")}/v1/google-calendar/webhook`,
      },
    });

    await this.prisma.googleWatch.upsert({
      where: { userId },
      create: {
        userId,
        channelId: response.data.id!,
        resourceId: response.data.resourceId!,
        expiration: new Date(Number(response.data.expiration)),
      },
      update: {
        channelId: response.data.id!,
        resourceId: response.data.resourceId!,
        expiration: new Date(Number(response.data.expiration)),
      },
    });

    return response.data;
  }

  async handleWebhook(resourceId: string) {
    const watch = await this.prisma.googleWatch.findFirst({
      where: { resourceId },
    });

    if (!watch) return;

    await this.syncEvents(watch.userId);
  }

  async syncEvents(userId: string) {
    const calendar = await this.getClientByUser(userId);

    const events = await calendar.events.list({
      calendarId: "primary",
      singleEvents: true,
      showDeleted: true,
    });

    const items = events.data.items ?? [];

    for (const event of items) {
      if (!event.id) continue;

      const existing = await this.prisma.appointment.findFirst({
        where: { googleEventId: event.id },
      });

      if (!existing) continue;

      if (event.status === "cancelled") {
        await this.prisma.appointment.delete({
          where: { id: existing.id },
        });
      } else {
        await this.prisma.appointment.update({
          where: { id: existing.id },
          data: {
            date: event.start?.dateTime ?? existing.date,
          },
        });
      }
    }
    this.notificationGateway.sendToUser(userId, "Seu evento foi atualizado");
  }

  async listEvents(userId: string): Promise<calendar_v3.Schema$Event[]> {
    const calendar = await this.getAuthenticatedClient(userId);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items ?? [];
  }

  async createEvent(
    event: calendar_v3.Schema$Event,
    userId: string,
  ): Promise<calendar_v3.Schema$Event> {
    const calendar = await this.getAuthenticatedClient(userId);

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return response.data;
  }

  async deleteEvent(eventId: string, userId: string): Promise<void> {
    const calendar = await this.getAuthenticatedClient(userId);

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
  }

  async getStatus(
    userId: string,
  ): Promise<{ connected: boolean; email?: string }> {
    const token = await this.prisma.googleToken.findUnique({
      where: { userId },
    });

    if (!token) return { connected: false };

    this.oauth2Client.setCredentials({
      access_token: token.accessToken,
    });

    const oauth2 = google.oauth2({
      version: "v2",
      auth: this.oauth2Client,
    });

    try {
      const { data } = await oauth2.userinfo.get();
      return { connected: true, email: data.email ?? undefined };
    } catch {
      return { connected: true };
    }
  }

  async disconnectGoogle(userId: string): Promise<void> {
    const token = await this.prisma.googleToken.findUnique({
      where: { userId },
    });

    if (token) {
      await this.oauth2Client.revokeToken(token.accessToken).catch(() => {});
      await this.prisma.googleToken.delete({ where: { userId } });
    }

    await this.prisma.googleWatch.deleteMany({
      where: { userId },
    });
  }
}
