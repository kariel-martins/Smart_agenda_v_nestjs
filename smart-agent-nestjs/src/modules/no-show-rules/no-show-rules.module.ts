import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { NoShowRulesController } from './no-show-rules.controller'
import { NoShowRulesService } from './no-show-rules.service'

@Module({
  controllers: [NoShowRulesController],
  providers: [NoShowRulesService, PrismaService, ExecuteHandler, RequestContextService],
})
export class NoShowRulesModule {}
