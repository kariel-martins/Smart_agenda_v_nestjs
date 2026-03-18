import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { JobsService } from '../jobs/jobs.service'
import { ProfessionalController } from './professional.controller'
import { ProfessionalService } from './professional.service'

@Module({
  controllers: [ProfessionalController],
  providers: [
    ProfessionalService,
    PrismaService,
    RequestContextService,
    ExecuteHandler,
    JobsService,
  ],
})
export class ProfessionalModule {}
