import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { InsertWhatsApp } from "../dtos/send-notification.dto";

@Injectable()
export class WhatsappProvider {
  private readonly logger = new Logger(WhatsappProvider.name);
  private readonly baseUrl: string;
  private readonly clientToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    const instanceId = this.config.get<string>("ZAPI_INSTANCE_ID");
    const token = this.config.get<string>("ZAPI_TOKEN");
    this.clientToken = this.config.get<string>("ZAPI_CLIENT_TOKEN")!;

    this.baseUrl = `https://api.z-api.io/instances/${instanceId}/token/${token}`;
  }

  async send(data: InsertWhatsApp): Promise<void> {
    const phone = this.formatPhone(data.to);
    this.logger.log(`Formatando número: ${data.to} → ${phone}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/send-text`,
          {
            phone,
            message: data.message,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Client-Token": this.clientToken,
            },
          },
        ),
      );

      this.logger.log(
        `WhatsApp enviado para ${phone} | ID: ${response.data?.zaapId}`,
      );
    } catch (error: any) {
      this.logger.error("Erro ao enviar WhatsApp", error.stack);
      throw error;
    }
  }

  private formatPhone(phone: string): string {
    let digits = phone.replace(/\D/g, "");

    if (!digits.startsWith("55")) {
      digits = `55${digits}`;
    }

    if (digits.length === 13) {
      digits = digits.slice(0, 4) + digits.slice(5);
    }

    return digits;
  }
}
