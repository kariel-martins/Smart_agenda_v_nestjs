import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { AvailibilityController } from './availibility.controller'
import { AvailibilityService } from './availibility.service'

@Module({
  controllers: [AvailibilityController],
  providers: [AvailibilityService, PrismaService, ExecuteHandler, RequestContextService],
})
export class AvailibilityModule {}
