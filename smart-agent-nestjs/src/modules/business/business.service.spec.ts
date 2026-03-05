import { Test, TestingModule } from '@nestjs/testing'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { userServiceMock } from '../services/service.mock'
import { BusinessMock } from './business.mock'
import { BusinessService } from './business.service'

describe('BusinessService', () => {
  let service: BusinessService
  let prisma: PrismaService
  let requestContext: RequestContextService

  const businessMock = new BusinessMock()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: PrismaService,
          useValue: {
            business: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUser: jest.fn(),
          },
        },
        {
          provide: ExecuteHandler,
          useValue: {
            repository: jest.fn((fn) => fn()),
          },
        },
      ],
    }).compile()

    service = await module.resolve<BusinessService>(BusinessService)
    prisma = await module.resolve<PrismaService>(PrismaService)
    requestContext = await module.resolve<RequestContextService>(RequestContextService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return business', async () => {
    jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(businessMock)
    jest.spyOn(requestContext, 'getUser').mockReturnValue(userServiceMock)

    const result = await service.findBusiness()

    expect(requestContext.getUser).toHaveBeenCalledTimes(1)
    expect(prisma.business.findFirst).toHaveBeenCalledWith({
      where: {
        id: userServiceMock.businessId,
      },
    })
    expect(result).toEqual(businessMock)
  })

  it('should update and return business', async () => {
    const updateData = { name: 'Updated Business' }

    jest.spyOn(requestContext, 'getUser').mockReturnValue(userServiceMock)
    jest.spyOn(prisma.business, 'update').mockResolvedValue({
      ...businessMock,
      ...updateData,
    } as any)

    const result = await service.update(updateData as any)

    expect(requestContext.getUser).toHaveBeenCalled()
    expect(prisma.business.update).toHaveBeenCalledWith({
      where: {
        id: userServiceMock.businessId,
      },
      data: updateData,
    })
    expect(result).toEqual({
      ...businessMock,
      ...updateData,
    })
  })
})
