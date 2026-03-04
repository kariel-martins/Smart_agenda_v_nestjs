import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { BusinessController } from './business.controller'
import { BusinessService } from './business.service'

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, PrismaService, ExecuteHandler, RequestContextService],
})
export class BusinessModule {}
