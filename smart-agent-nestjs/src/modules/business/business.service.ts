import { Injectable } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { UpdateBusinessDTO } from './business.dto'

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly requestContext: RequestContextService,
  ) {}

  async findBusiness() {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const findBusiness = await this.prisma.business.findFirst({
        where: {
          id: user.businessId,
        },
      })
      return findBusiness
    }, 'Não foi possível buscar negócio')
  }

  async update(data: UpdateBusinessDTO) {
    return this.execute.repository(async () => {
      const user = this.requestContext.getUser()
      const updateBusiness = await this.prisma.business.update({
        where: {
          id: user.businessId,
        },
        data,
      })
      return updateBusiness
    }, 'Não foi possível atualizar o negócio')
  }
}
