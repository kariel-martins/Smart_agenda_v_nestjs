import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { QueryPaginationDTO } from "src/common/dtos/query-pagination";
import { ExecuteHandler } from "src/common/handlers/execute.handler";
import { RequestContextService } from "src/common/services/request-context/request-context.service";
import { SEND_WHATSAPP_NOTIFICATION } from "src/consts";
import { PrismaService } from "src/prisma.service";
import { paginate, paginateOutput } from "src/utils/pagination.utils";
import { NoShowHandlerService } from "../no-show-rules/no-show-handler.service";
import { guardClientRestrictions } from "./appointment.client-restrictions";
import {
  AppointmentDTO,
  AppointmentRequestDTO,
  UpdateAppointmentDTO,
} from "./appointment.dto";

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly requestContext: RequestContextService,
    private readonly noShowHandler: NoShowHandlerService,

    @Inject("NOTIFICATIONS_SERVICE")
    private readonly client: ClientProxy,
  ) {}

  create(data: AppointmentRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser();

      const resultClientRestrictions = await guardClientRestrictions(
        data.clientId,
        this.prisma,
      );
      const result = await this.prisma.appointment.create({
        data: {
          businessId: user.businessId,
          ...data,
        },
      });

      this.client.emit(SEND_WHATSAPP_NOTIFICATION, {
        type: "whatsapp",
        action: "create",
        to: resultClientRestrictions.phone,
        data: {
          appointmentId: result.id,
        },
      });

      return result;
    }, "Não foi possível criar o agendamento");
  }

  findAll(query?: QueryPaginationDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser();
      const result = await this.prisma.appointment.findMany({
        ...paginate(query),
        where: {
          businessId: user.businessId,
        },
        include: {
          client: {
            select: {
              name: true,
            },
          },
          professional: {
            select: {
              name: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
      });

      const total = await this.prisma.appointment.count({
        where: {
          businessId: user.businessId,
        },
      });
      return paginateOutput<AppointmentDTO>(result, total, query);
    }, "Não foi possível criar o agendamento");
  }

  updateStatus(appointmentId: number, data: UpdateAppointmentDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser();

      const updated = await this.prisma.appointment.update({
        where: {
          id: appointmentId,
          businessId: user.businessId,
        },
        data: {
          status: data.status,
          cancelReason: data.cancelReason,
          confirmAt: data.status === "confirmed" ? new Date() : undefined,
        },
      });

      if (updated.status === "no_show") {
        await this.noShowHandler.applyNoShowRule(updated.id);
      }

      return updated;
    }, "Não foi possível atualizar o status do agendamento");
  }
}
