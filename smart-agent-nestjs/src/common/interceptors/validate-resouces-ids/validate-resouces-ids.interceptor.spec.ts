import { ExecutionContext, NotFoundException } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'
import { VALIDATE_RESOURCES_IDS_KEY } from 'src/consts'
import { PrismaService } from 'src/prisma.service'
import { ValidateResoucesIdsInterceptor } from './validate-resouces-ids.interceptor'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { userServiceMock } from 'src/modules/services/service.mock'

describe('ValidateResouresIdsInterceptor', () => {
  let interceptor: ValidateResoucesIdsInterceptor
  let reflector: Reflector
  let prisma: PrismaService
  let requestContext: RequestContextService

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
    getHandler: jest.fn(),
  } as unknown as ExecutionContext

  const mockCallHandler = {
    handle: jest.fn(() => of({})),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
  providers: [
    ValidateResoucesIdsInterceptor,
    {
      provide: Reflector,
      useValue: {
        get: jest.fn(),
      },
    },
    {
      provide: PrismaService,
      useValue: {
        professional: {
          findFirst: jest.fn(),
        },
      },
    },
    {
      provide: RequestContextService,
      useValue: {
        getUser: jest.fn(),
      },
    },
  ],
}).compile()

    interceptor = module.get<ValidateResoucesIdsInterceptor>(ValidateResoucesIdsInterceptor)
    reflector = module.get<Reflector>(Reflector)
    prisma = module.get<PrismaService>(PrismaService)
    requestContext = module.get<RequestContextService>(RequestContextService)
  })

  it('should skip validation if decorator id not present', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false)

    const result = await interceptor.intercept(mockExecutionContext, mockCallHandler)

    expect(reflector.get).toHaveBeenCalledWith(
      VALIDATE_RESOURCES_IDS_KEY,
      mockExecutionContext.getHandler(),
    )
    expect(result).toBeDefined()
    expect(prisma.professional.findFirst).not.toHaveBeenCalled()
  })

  it('should skip validation if decorator is not present', async () => {
  jest.spyOn(reflector, 'get').mockReturnValue(false)

  const result = await interceptor.intercept(mockExecutionContext, mockCallHandler)

  expect(result).toBeDefined()
  expect(prisma.professional.findFirst).not.toHaveBeenCalled()
})

  it('should throw if professional is not found', async () => {
  const mockRequest = {
    params: {
      professionalId: '1',
    },
  }

  jest.spyOn(reflector, 'get').mockReturnValue(true)

  jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
    getRequest: () => mockRequest,
  } as HttpArgumentsHost)

  jest.spyOn(requestContext, 'getUser').mockReturnValue({
    ...userServiceMock,
  })

  jest.spyOn(prisma.professional, 'findFirst').mockResolvedValue(null)

  await expect(interceptor.intercept(mockExecutionContext, mockCallHandler)).rejects.toThrow(
    NotFoundException,
  )

  expect(prisma.professional.findFirst).toHaveBeenCalledWith({
    where: {
      id: 1,
      businessId: userServiceMock.businessId,
    },
  })
})

it('should continue if professional exists', async () => {
  const mockRequest = {
    params: {
      professionalId: '1',
    },
  }

  jest.spyOn(reflector, 'get').mockReturnValue(true)

  jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
    getRequest: () => mockRequest,
  } as HttpArgumentsHost)

  jest.spyOn(requestContext, 'getUser').mockReturnValue({
    ...userServiceMock,
  })

  jest
    .spyOn(prisma.professional, 'findFirst')
    .mockResolvedValue({ id: 1, businessId: userServiceMock.businessId } as any)

  const result = await interceptor.intercept(mockExecutionContext, mockCallHandler)

  expect(result).toBeDefined()
  expect(prisma.professional.findFirst).toHaveBeenCalledWith({
    where: {
      id: 1,
      businessId: userServiceMock.businessId,
    },
  })
})
})
