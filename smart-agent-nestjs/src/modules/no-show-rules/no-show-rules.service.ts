import { Injectable } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { NoShowRuleRequestDTO, UpdateNoShowRuleRequestDTO } from './no-show-rules.dto'

@Injectable()
export class NoShowRulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
    private readonly RequestContext: RequestContextService,
  ) {}

  create(data: NoShowRuleRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const newNoShow = await this.prisma.noShowRule.create({
        data: {
          businessId: user.businessId,
          ...data,
        },
      })

      return newNoShow
    }, 'Não foi possível marca o cancelamento')
  }

  findAll() {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const findAllNoShowRules = await this.prisma.noShowRule.findMany({
        where: {
          businessId: user.businessId,
        },
      })

      return findAllNoShowRules
    }, 'Não há cancelamentos disponíveis!')
  }

  update(noShowId: number, data: UpdateNoShowRuleRequestDTO) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const updateNoShowRule = await this.prisma.noShowRule.update({
        where: {
          businessId: user.businessId,
          id: noShowId,
        },
        data,
      })

      return updateNoShowRule
    }, 'Não foi possível atualizar o cancelamento')
  }

  delete(noShowId: number) {
    return this.execute.repository(async () => {
      const user = this.RequestContext.getUser()
      const deleteNoShow = await this.prisma.noShowRule.delete({
        where: {
          businessId: user.businessId,
          id: noShowId,
        },
      })

      return deleteNoShow
    }, 'Não foi possível remove o cancelamento')
  }
}
