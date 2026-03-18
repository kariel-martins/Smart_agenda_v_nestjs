import { Injectable } from "@nestjs/common";
import { ExecuteHandler } from "src/common/handlers/execute.handler";
import { RequestContextService } from "src/common/services/request-context/request-context.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class NoShowHandlerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly requestContext: RequestContextService,
  ) {}

  applyNoShowRule(appointmentId: number) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser();
      const appointment = await this.prisma.appointment.findUniqueOrThrow({
        where: { id: appointmentId, businessId: user.businessId },
        include: { client: true },
      });

      const { client, businessId } = appointment;

      const newNoShowCount = (client.noShowCount ?? 0) + 1;
      const total = client.totalAppointments ?? 1;
      const noShowRate = (newNoShowCount / total) * 100;

      await this.prisma.client.update({
        where: { id: client.id },
        data: { noShowCount: newNoShowCount },
      });

      const rule = await this.prisma.noShowRule.findFirst({
        where: { businessId },
      });

      if (!rule?.maxRatePercent || !rule?.action) return null;

      if (noShowRate < rule.maxRatePercent) return null;

      await this.applyClientRestriction(rule.action, client.id);

      await this.prisma.notificationLog.create({
        data: {
          appointmentId,
          type: `no_show_action:${rule.action}`,
          status: "sent",
        },
      });

      return rule.action;
    }, "Não foi possível aplicar a regra de no-show");
  }

  private async applyClientRestriction(
    action: "block_booking" | "require_deposit" | "manual_approval",
    clientId: string,
  ) {
    // Mapeamento direto da action para o campo no Client
    const fieldMap = {
      block_booking: { isBlocked: true },
      require_deposit: { requiresDeposit: true },
      manual_approval: { pendingApproval: true },
    };

    await this.prisma.client.update({
      where: { id: clientId },
      data: fieldMap[action],
    });
  }
}
