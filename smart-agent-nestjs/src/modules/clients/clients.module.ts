import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { ClientsController } from './clients.controller'
import { ClientsService } from './clients.service'

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService, RequestContextService, ExecuteHandler],
})
export class ClientsModule {}
