import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { VALIDATE_RESOURCES_IDS_KEY } from 'src/consts'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ValidateResoucesIdsInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Request>> {
    const shouldValidate = this.reflector.get<boolean>(
      VALIDATE_RESOURCES_IDS_KEY,
      context.getHandler(),
    )
    if (!shouldValidate) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const professionalId = Number(request.params.professionalId)
    const user = this.requestContext.getUser()

    const professional = await this.prisma.professional.findFirst({
      where: {
        id: professionalId,
        businessId: user.businessId,
      },
    })
    if (!professional) throw new NotFoundException('professional not found')

    return next.handle()
  }
}
