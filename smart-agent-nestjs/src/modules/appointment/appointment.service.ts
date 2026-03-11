import { Injectable } from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import {
  AppointmentDTO,
  AppointmentRequestDTO,
  FindAppointmentsQueryDTO,
  UpdateAppointmentDTO,
} from './appointment.dto'

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly requestContext: RequestContextService,
  ) {}

  create(data: AppointmentRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const result = await this.prisma.appointment.create({
        data: {
          businessId: user.businessId,
          ...data,
        },
      })

      return result
    }, 'Não foi possível criar o agendamento')
  }

  findAll(query?: QueryPaginationDTO, params?: FindAppointmentsQueryDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
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
      })

      const total = await this.prisma.appointment.count({
        where: {
          businessId: user.businessId,
        },
      })
      return paginateOutput<AppointmentDTO>(result, total, query)
    }, 'Não foi possível criar o agendamento')
  }

  update(appointmentId: number, data: UpdateAppointmentDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const result = await this.prisma.appointment.update({
        where: {
          businessId: user.businessId,
          id: appointmentId,
        },
        data: {
          status: data.status,
        },
      })

      return result
    }, 'Não foi possível criar o agendamento')
  }
}
