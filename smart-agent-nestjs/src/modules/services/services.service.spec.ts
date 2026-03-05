import { Test, TestingModule } from '@nestjs/testing'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { paginateOutput } from 'src/utils/pagination.utils'
import { mockPaginationQuery, serviceMock, userServiceMock } from './service.mock'
import { ServicesService } from './services.service'

describe('ServicesService', () => {
  let service: ServicesService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: ExecuteHandler,
          useValue: {
            repository: jest.fn((fn) => fn()),
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUser: jest.fn().mockReturnValue(userServiceMock),
          },
        },
      ],
    }).compile()

    service = module.get<ServicesService>(ServicesService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be able create service!', async () => {
    const services = serviceMock[0]
    jest.spyOn(prisma.service, 'create').mockResolvedValue(services)

    const result = await service.create({
      name: services.name,
      price: services.durationMinutes,
      durationMinutes: services.durationMinutes,
    })

    expect(result).toEqual(services)
    expect(prisma.service.create).toHaveBeenCalledTimes(1)
  })

  it('Should be possible to search for a service', async () => {
    const services = serviceMock[0]
    jest.spyOn(prisma.service, 'findFirst').mockResolvedValue(services)

    const result = await service.findById(services.id)

    expect(result).toEqual(services)
    expect(prisma.service.findFirst).toHaveBeenCalledTimes(1)
  })

  it('Should be possible to search for all services', async () => {
    jest.spyOn(prisma.service, 'findMany').mockResolvedValue(serviceMock)
    jest.spyOn(prisma.service, 'count').mockResolvedValue(serviceMock.length)

    const result = await service.findAll()

    expect(result).toEqual(paginateOutput(serviceMock, serviceMock.length, mockPaginationQuery))
    expect(prisma.service.findMany).toHaveBeenCalledTimes(1)
    expect(prisma.service.count).toHaveBeenCalledTimes(1)
  })

  it('Should be possible to update the service', async () => {
    const services = serviceMock[0]
    jest.spyOn(prisma.service, 'update').mockResolvedValue(services)

    const result = await service.update(services.id, {
      durationMinutes: services.durationMinutes,
      name: services.name,
      price: services.price,
    })

    expect(result).toEqual(services)
    expect(prisma.service.update).toHaveBeenCalledTimes(1)
  })

  it('Should be possible to delete the service', async () => {
    const services = serviceMock[0]
    jest.spyOn(prisma.service, 'delete').mockResolvedValue(services)

    const result = await service.delete(services.id)

    expect(result).toEqual(services)
    expect(prisma.service.delete).toHaveBeenCalledTimes(1)
  })
})
