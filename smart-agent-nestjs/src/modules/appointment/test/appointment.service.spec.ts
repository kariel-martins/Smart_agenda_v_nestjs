import { Test, TestingModule } from '@nestjs/testing'
import { AppointmentService } from './appointment.service'
import { PrismaService } from 'src/prisma.service'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'

describe('AppointmentService', () => {
  let service: AppointmentService
  let prisma: PrismaService
  let requestContext: RequestContextService

  const userMock = {
    id: 'user-1',
    businessId: 'business-1',
  }

  const appointmentMock = {
    id: 1,
    businessId: 'business-1',
    clientId: 'client-1',
    professionalId: 10,
    status: 'pending',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
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
            getUser: jest.fn().mockReturnValue(userMock),
          },
        },
      ],
    }).compile()

    service = module.get<AppointmentService>(AppointmentService)
    prisma = module.get<PrismaService>(PrismaService)
    requestContext = module.get<RequestContextService>(RequestContextService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create appointment successfully', async () => {
      jest.spyOn(prisma.appointment, 'create').mockResolvedValue(appointmentMock as any)

      const data = {
        clientId: 'client-1',
        professionalId: 10,
      }

      const result = await service.create(data as any)

      expect(requestContext.getUser).toHaveBeenCalled()
      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: {
          businessId: userMock.businessId,
          ...data,
        },
      })

      expect(result).toEqual(appointmentMock)
    })

    it('should throw error when prisma fails', async () => {
      jest.spyOn(prisma.appointment, 'create').mockRejectedValue(new Error())

      await expect(
        service.create({ clientId: 'client-1' } as any),
      ).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should return paginated appointments', async () => {
      jest.spyOn(prisma.appointment, 'findMany').mockResolvedValue([appointmentMock] as any)
      jest.spyOn(prisma.appointment, 'count').mockResolvedValue(1)

      const query = { page: 1, limit: 10 }
      const params = { professionalId: 10 }

      const result = await service.findAll(query as any, params as any)

      expect(prisma.appointment.findMany).toHaveBeenCalled()
      expect(prisma.appointment.count).toHaveBeenCalledWith({
        where: {
          businessId: userMock.businessId,
        },
      })

      expect(result).toBeDefined()
    })

    it('should throw error when prisma fails', async () => {
      jest.spyOn(prisma.appointment, 'findMany').mockRejectedValue(new Error())

      await expect(
        service.findAll({ page: 1, limit: 10 } as any, {}),
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update appointment successfully', async () => {
      const updated = { ...appointmentMock, status: 'confirmed' }

      jest.spyOn(prisma.appointment, 'update').mockResolvedValue(updated as any)

      const result = await service.updateStatus(1, { status: 'confirmed' } as any)

      expect(prisma.appointment.update).toHaveBeenCalledWith({
        where: {
          businessId: userMock.businessId,
          id: 1,
        },
        data: {
          status: 'confirmed',
        },
      })

      expect(result).toEqual(updated)
    })

    it('should throw error when prisma fails', async () => {
      jest.spyOn(prisma.appointment, 'update').mockRejectedValue(new Error())

      await expect(
        service.updateStatus(1, { status: 'confirmed' } as any),
      ).rejects.toThrow()
    })
  })
})