import { BadRequestException, Injectable } from "@nestjs/common";
import { QueryPaginationDTO } from "src/common/dtos/query-pagination";
import { ExecuteHandler } from "src/common/handlers/execute.handler";
import { RequestContextService } from "src/common/services/request-context/request-context.service";
import { PrismaService } from "src/prisma.service";
import { paginate, paginateOutput } from "src/utils/pagination.utils";
import {
  AppointmentDTO,
  AppointmentRequestDTO,
  FindAppointmentsQueryDTO,
  UpdateAppointmentDTO,
} from "./appointment.dto";
import { NoShowHandlerService } from "../no-show-rules/no-show-handler.service";
import { guardClientRestrictions } from "./appointment.client-restrictions";

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly requestContext: RequestContextService,
    private readonly noShowHandler: NoShowHandlerService,
  ) {}

  create(data: AppointmentRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser();

      await guardClientRestrictions(data.clientId, this.prisma);
      const result = await this.prisma.appointment.create({
        data: {
          businessId: user.businessId,
          ...data,
        },
      });

      return result;
    }, "Não foi possível criar o agendamento");
  }

  findAll(query?: QueryPaginationDTO, params?: FindAppointmentsQueryDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser();
      const result = await this.prisma.appointment.findMany({
        ...paginate(query),
        where: {
          businessId: user.businessId,
          ...params,
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
