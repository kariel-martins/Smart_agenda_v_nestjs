import { Module } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { PrismaService } from 'src/prisma.service'
import { JobsController } from './jobs.controller'
import { JobsService } from './jobs.service'

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService, ExecuteHandler],
})
export class JobsModule {}
