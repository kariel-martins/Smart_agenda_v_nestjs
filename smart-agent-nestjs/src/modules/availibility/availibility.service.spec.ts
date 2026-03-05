import { Test, TestingModule } from '@nestjs/testing'
import { AvailibilityService } from './availibility.service'
import { PrismaService } from 'src/prisma.service'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'

describe('AvailibilityService', () => {
  let service: AvailibilityService
  let prisma: PrismaService

  const availabilityMock = {
    id: 1,
    professionalId: 10,
    day: 'monday',
    startTime: '08:00',
    endTime: '18:00',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailibilityService,
        {
          provide: PrismaService,
          useValue: {
            availability: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
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

    service = module.get<AvailibilityService>(AvailibilityService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create availability successfully', async () => {
      jest.spyOn(prisma.availability, 'create').mockResolvedValue(availabilityMock as any)

      const result = await service.create(10, {
        day: 'monday',
        startTime: '08:00',
        endTime: '18:00',
      } as any)

      expect(prisma.availability.create).toHaveBeenCalledWith({
        data: {
          professionalId: 10,
          day: 'monday',
          startTime: '08:00',
          endTime: '18:00',
        },
      })

      expect(result).toEqual(availabilityMock)
    })

    it('should throw error when create fails', async () => {
      jest.spyOn(prisma.availability, 'create').mockRejectedValue(new Error())

      await expect(
        service.create(10, {
          day: 'monday',
        } as any),
      ).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should return all availability', async () => {
      jest.spyOn(prisma.availability, 'findMany').mockResolvedValue([availabilityMock] as any)

      const result = await service.findAll(10)

      expect(prisma.availability.findMany).toHaveBeenCalledWith({
        where: {
          professionalId: 10,
        },
      })

      expect(result).toEqual([availabilityMock])
    })

    it('should throw error when findAll fails', async () => {
      jest.spyOn(prisma.availability, 'findMany').mockRejectedValue(new Error())

      await expect(service.findAll(10)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update availability successfully', async () => {
      const updated = { ...availabilityMock, startTime: '09:00' }

      jest.spyOn(prisma.availability, 'update').mockResolvedValue(updated as any)

      const result = await service.update(
        10,
        1,
        { startTime: '09:00' } as any,
      )

      expect(prisma.availability.update).toHaveBeenCalledWith({
        where: {
          id: 1,
          professionalId: 10,
        },
        data: {
          startTime: '09:00',
        },
      })

      expect(result).toEqual(updated)
    })

    it('should throw error when update fails', async () => {
      jest.spyOn(prisma.availability, 'update').mockRejectedValue(new Error())

      await expect(
        service.update(10, 1, { startTime: '09:00' } as any),
      ).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should delete availability successfully', async () => {
      jest.spyOn(prisma.availability, 'delete').mockResolvedValue(availabilityMock as any)

      const result = await service.delete(10, 1)

      expect(prisma.availability.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
          professionalId: 10,
        },
      })

      expect(result).toEqual(availabilityMock)
    })

    it('should throw error when delete fails', async () => {
      jest.spyOn(prisma.availability, 'delete').mockRejectedValue(new Error())

      await expect(service.delete(10, 1)).rejects.toThrow()
    })
  })
})