import { Test, TestingModule } from '@nestjs/testing'
import { ClientsController } from './clients.controller'
import { ClientsModule } from './clients.module'
import { ClientsService } from './clients.service'
import { PrismaService } from 'src/prisma.service'

describe('ClientsController', () => {
  let controller: ClientsController
  let service: ClientsService

  const clientMock = {
    id: 'client-1',
    name: 'Client Test',
    businessId: 'business-1',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule],
    })
      .overrideProvider(ClientsService)
      .useValue({
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile()

    controller = await module.resolve<ClientsController>(ClientsController)
    service = await module.resolve<ClientsService>(ClientsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create client successfully', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(clientMock as any)

      const result = await controller.create({ name: 'Client Test' } as any)

      expect(service.create).toHaveBeenCalledWith({ name: 'Client Test' })
      expect(result).toEqual(clientMock)
    })

    it('should throw error when create fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error())

      await expect(
        controller.create({ name: 'Client Test' } as any),
      ).rejects.toThrow()
    })
  })

  describe('findById', () => {
    it('should return client', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(clientMock as any)

      const result = await controller.findById('client-1')

      expect(service.findById).toHaveBeenCalledWith('client-1')
      expect(result).toEqual(clientMock)
    })

    it('should throw error when service fails', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new Error())

      await expect(controller.findById('client-1')).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should return clients list', async () => {
      const response = {
        data: [clientMock],
        total: 1,
        page: 1,
        limit: 10,
      }

      jest.spyOn(service, 'findAll').mockResolvedValue(response as any)

      const result = await controller.findAll({ page: 1, limit: 10 } as any)

      expect(service.findAll).toHaveBeenCalled()
      expect(result).toEqual(response)
    })

    it('should throw error when service fails', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error())

      await expect(controller.findAll()).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update client successfully', async () => {
      const updated = { ...clientMock, name: 'Updated' }

      jest.spyOn(service, 'update').mockResolvedValue(updated as any)

      const result = await controller.update(
        'client-1',
        { name: 'Updated' } as any,
      )

      expect(service.update).toHaveBeenCalledWith(
        'client-1',
        { name: 'Updated' },
      )
      expect(result).toEqual(updated)
    })

    it('should throw error when update fails', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new Error())

      await expect(
        controller.update('client-1', { name: 'Updated' } as any),
      ).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should delete client successfully', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(clientMock as any)

      const result = await controller.remove('client-1')

      expect(service.delete).toHaveBeenCalledWith('client-1')
      expect(result).toEqual(clientMock)
    })

    it('should throw error when delete fails', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new Error())

      await expect(controller.remove('client-1')).rejects.toThrow()
    })
  })
})