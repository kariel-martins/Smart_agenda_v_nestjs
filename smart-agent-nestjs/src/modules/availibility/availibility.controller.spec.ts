import { Test, TestingModule } from '@nestjs/testing'
import { AvailibilityController } from './availibility.controller'
import { AvailibilityService } from './availibility.service'
import { AvailibilityModule } from './availibility.module'
import { PrismaService } from 'src/prisma.service'

describe('AvailibilityController', () => {
  let controller: AvailibilityController
  let service: AvailibilityService

  const availabilityMock = {
    id: 1,
    professionalId: 10,
    dayOfWeek: 'monday',
    startTime: '08:00',
    endTime: '18:00',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AvailibilityModule],
    })
      .overrideProvider(AvailibilityService)
      .useValue({
        create: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile()

    controller = await module.resolve<AvailibilityController>(AvailibilityController)
    service = await module.resolve<AvailibilityService>(AvailibilityService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create availability successfully', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(availabilityMock as any)

      const result = await controller.create(
        10,
        {
          day: 'monday',
          startTime: '08:00',
          endTime: '18:00',
        } as any,
      )

      expect(service.create).toHaveBeenCalledWith(10, {
        day: 'monday',
        startTime: '08:00',
        endTime: '18:00',
      })

      expect(result).toEqual(availabilityMock)
    })

    it('should throw error when service fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error())

      await expect(
        controller.create(10, {
          day: 'monday',
        } as any),
      ).rejects.toThrow()
    })
  })

  describe('getAll', () => {
    it('should return availability list', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([availabilityMock] as any)

      const result = await controller.findAll(10)

      expect(service.findAll).toHaveBeenCalledWith(10)
      expect(result).toEqual([availabilityMock])
    })

    it('should throw error when service fails', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error())

      await expect(controller.findAll(10)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update availability successfully', async () => {
      const updated = { ...availabilityMock, startTime: '09:00' }

      jest.spyOn(service, 'update').mockResolvedValue(updated as any)

      const result = await controller.update(
        10,
        1,
        { startTime: '09:00' } as any,
      )

      expect(service.update).toHaveBeenCalledWith(
        10,
        1,
        { startTime: '09:00' },
      )

      expect(result).toEqual(updated)
    })

    it('should throw error when update fails', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new Error())

      await expect(
        controller.update(10, 1, { startTime: '09:00' } as any),
      ).rejects.toThrow()
    })
  })

  describe('remove', () => {
    it('should delete availability successfully', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(availabilityMock)

      const result = await controller.remove(10, 1)

      expect(service.delete).toHaveBeenCalledWith(10, 1)
      expect(result).toEqual(availabilityMock)
    })

    it('should throw error when delete fails', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new Error())

      await expect(controller.remove(10, 1)).rejects.toThrow()
    })
  })
})