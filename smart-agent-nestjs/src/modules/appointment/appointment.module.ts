import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { AppointmentController } from './appointment.controller'
import { AppointmentService } from './appointment.service'
import { NoShowHandlerService } from '../no-show-rules/no-show-handler.service'

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, PrismaService, RequestContextService, ExecuteHandler, NoShowHandlerService
  ],
})
export class AppointmentModule {}
