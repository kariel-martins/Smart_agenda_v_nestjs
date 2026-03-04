import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService, RequestContextService, ExecuteHandler],
})
export class ServicesModule {}
