import { Injectable } from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'
import {
  ClientDTO,
  ClientRequestDTO,
  FindQueryClientDTO,
  UpdateClientRequestDTO,
} from './client.dto'

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(data: ClientRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const newClient = await this.prisma.client.create({
        data: {
          businessId: user.businessId,
          ...data,
        },
      })
      return newClient
    }, 'Não foi possível registar o cliente!')
  }

  async findById(clientId: string) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const newClient = await this.prisma.client.findFirst({
        where: {
          businessId: user.businessId,
          id: clientId,
        },
      })
      return newClient
    }, 'Não foi possível buscar o cliente!')
  }
  async findAll(query?: QueryPaginationDTO, params?: FindQueryClientDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const newClient = await this.prisma.client.findMany({
        ...paginate(query),
        where: {
          businessId: user.businessId,
          ...params,
        },
      })

      const total = await this.prisma.client.count({
        where: {
          businessId: user.businessId,
        },
      })

      return paginateOutput<ClientDTO>(newClient, total, query)
    }, 'Não há clientes disponíveis!')
  }
  async update(clientId: string, data: UpdateClientRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const newClient = await this.prisma.client.update({
        where: {
          businessId: user.businessId,
          id: clientId,
        },
        data,
      })
      return newClient
    }, 'Não foi possível update o cliente!')
  }
  async delete(clientId: string) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const newClient = await this.prisma.client.delete({
        where: {
          businessId: user.businessId,
          id: clientId,
        },
      })
      return newClient
    }, 'Não foi possível delete o cliente!')
  }
}
