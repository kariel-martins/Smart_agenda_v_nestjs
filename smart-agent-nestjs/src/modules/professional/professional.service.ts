import { Injectable } from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import {
  findQueryProfessionalDTO,
  ProfessionalDTO,
  ProfessionalRequestDTO,
  UpdateProfessionalRequestDTO,
} from './professional.dto'

@Injectable()
export class ProfessionalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly RequestContext: RequestContextService,
  ) {}

  create(data: ProfessionalRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const result = await this.prisma.professional.create({
        data: {
          businessId: user.businessId,
          ...data,
        },
      })

      return result
    }, 'Não foi registrar o proficional!')
  }

  findAll(query?: QueryPaginationDTO, params?: findQueryProfessionalDTO) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const result = await this.prisma.professional.findMany({
        ...paginate(query),
        where: {
          businessId: user.businessId,
          ...params,
        },
      })

      const total = await this.prisma.professional.count({
        where: {
          businessId: user.businessId,
        },
      })

      return paginateOutput<ProfessionalDTO>(result, total, query)
    }, 'Não há proficionais disponíveis!')
  }

  findById(professionalId: number) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const result = await this.prisma.professional.findFirst({
        where: {
          businessId: user.businessId,
          id: professionalId,
        },
        include: {
          availabilities: true,
          appointments: {
            include: {
              client: {
                select: {
                  name: true,
                },
              },
            },
          },
          service: {
            select: {
              service: true,
            },
          },
        },
      })

      return result
    }, 'Não foi buscar o proficional!')
  }

  update(professionalId: number, data: UpdateProfessionalRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const result = await this.prisma.professional.update({
        where: {
          businessId: user.businessId,
          id: professionalId,
        },
        data,
      })

      return result
    }, 'Não foi atualizar o proficional!')
  }

  delete(professionalId: number) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const result = await this.prisma.professional.delete({
        where: {
          businessId: user.businessId,
          id: professionalId,
        },
      })

      return result
    }, 'Não foi delete o proficional!')
  }
}
