import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { calendar_v3, google } from "googleapis";
import { RequestContextService } from "src/common/services/request-context/request-context.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class GoogleCalendarService {
  private readonly oauth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly requestContext: RequestContextService,
  ) {
    const clientId = this.config.get("GOOGLE_CLIENT_ID");
    const clientSecret = this.config.get("GOOGLE_CLIENT_SECRET");
    const callbackUrl = this.config.get("GOOGLE_CALLBACK_URL");

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      callbackUrl,
    );
  }

  getAuthUrl(): string {
    const userId = this.requestContext.getUserId();
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
      throw new UnauthorizedException("Token do Google inválido");
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

    return { message: "Google Calendar conectado com sucesso!" };
  }

  private async getAuthenticatedClient() {
    const userId = this.requestContext.getUserId();
    const tokenRecord = await this.prisma.googleToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      throw new NotFoundException("Usuário não conectou o Google Calendar");
    }

    this.oauth2Client.setCredentials({
      access_token: tokenRecord.accessToken,
      refresh_token: tokenRecord.refreshToken,
    });

    if (tokenRecord.expiresAt < new Date()) {
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

  async listEvents(): Promise<calendar_v3.Schema$Event[]> {
    const calendar = await this.getAuthenticatedClient();

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items ?? [];
  }

  async createEvent(
    event: calendar_v3.Schema$Event,
  ): Promise<calendar_v3.Schema$Event> {
    const calendar = await this.getAuthenticatedClient();

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    return response.data;
  }

  async getStatus(): Promise<{ connected: boolean; email?: string }> {
    const userId = this.requestContext.getUserId();
    const token = await this.prisma.googleToken.findUnique({
      where: { userId },
      select: { accessToken: true },
    });

    if (!token) return { connected: false };
    const oauth2 = google.oauth2({ version: "v2", auth: this.oauth2Client });
    this.oauth2Client.setCredentials({ access_token: token.accessToken });

    try {
      const { data } = await oauth2.userinfo.get();
      return { connected: true, email: data.email ?? undefined };
    } catch {
      return { connected: true };
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    const calendar = await this.getAuthenticatedClient();

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
  }

  async disconnectGoogle(): Promise<void> {
    const userId = this.requestContext.getUserId();
    const token = await this.prisma.googleToken.findUnique({
      where: { userId },
    });

    if (token) {
      await this.oauth2Client.revokeToken(token.accessToken).catch(() => {});
      await this.prisma.googleToken.delete({ where: { userId } });
    }
  }
}
