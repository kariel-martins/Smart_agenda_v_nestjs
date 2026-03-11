import { Injectable } from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import {
  findQueryServiceDTO,
  ServiceDTO,
  ServiceRequestDTO,
  ServiceUpdateRequestDTO,
} from './services.dto'

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
    private readonly execute: ExecuteHandler,
  ) {}

  async create(data: ServiceRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()

      const { professionalId, ...rest } = data

      const newService = await this.prisma.$transaction(async (tx) => {
        const service = await tx.service.create({
          data: {
            businessId: user.businessId,
            ...rest,
          },
        })
        await tx.professionalService.create({
          data: {
            professionalId,
            serviceId: service.id,
          },
        })
      })

      return newService
    }, 'Não foi possível crair o serviço!')
  }
  async findById(serviceId: number) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()

      const newService = await this.prisma.service.findFirst({
        where: {
          id: serviceId,
          businessId: user.businessId,
        },
        include: {
          professional: true,
          appointments: {
            select: {
              status: true,
              date: true,
              createdAt: true,
              client: true,
            },
          },
        },
      })
      return newService
    }, 'Não foi possível buscar o serviço!')
  }
  async findAll(query?: QueryPaginationDTO, params?: findQueryServiceDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()

      const newService = await this.prisma.service.findMany({
        ...paginate(query),
        where: {
          businessId: user.businessId,
          ...params,
        },
      })

      const total = await this.prisma.service.count({
        where: {
          businessId: user.businessId,
        },
      })

      return paginateOutput<ServiceDTO>(newService, total, query)
    }, 'Não há serviço disponívies!')
  }
  async update(serviceId: number, data: ServiceUpdateRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()

      const newService = await this.prisma.service.update({
        where: {
          id: serviceId,
          businessId: user.businessId,
        },
        data,
      })
      return newService
    }, 'Não foi possível atualizar o serviço!')
  }

  async delete(serviceId: number) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()

      const newService = await this.prisma.service.delete({
        where: {
          id: serviceId,
          businessId: user.businessId,
        },
      })
      return newService
    }, 'Não foi possível deletar o serviço!')
  }
}
