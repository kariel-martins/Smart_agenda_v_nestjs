import { HttpException, HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma.service'
import { paginateOutput } from 'src/utils/pagination.utils'
import { mockPaginationQuery, serviceByIdMock, serviceMock } from './service.mock'
import { ServicesController } from './services.controller'
import { ServicesModule } from './services.module'
import { ServicesService } from './services.service'

describe('ServicesController', () => {
  let controller: ServicesController
  let service: ServicesService

  const servicesSeviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServicesModule],
    })
      .overrideProvider(ServicesService)
      .useValue(servicesSeviceMock)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile()

    controller = await module.resolve<ServicesController>(ServicesController)
    service = await module.resolve<ServicesService>(ServicesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Service/controller/create', () => {
    it('Should be possible to create a service', async () => {
      const services = serviceMock[0]
      jest.spyOn(service, 'create').mockResolvedValue(services)

      const result = await controller.create({
        name: services.name,
        price: services.durationMinutes,
        durationMinutes: services.durationMinutes,
      })

      expect(result).toEqual(services)
      expect(service.create).toHaveBeenCalledTimes(1)
    })

    it('It should be possible to return an error due to missing fields', async () => {
      const error = new HttpException('Não foi possível crair o serviço!', HttpStatus.NOT_FOUND)
      jest.spyOn(service, 'create').mockRejectedValue(error)

      await expect(
        controller.create({
          name: '',
          price: '123',
          durationMinutes: '34',
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('Service/controller/findAll', () => {
    it('Should be possible to search for all services', async () => {
      const findAllServices = paginateOutput(serviceMock, serviceMock.length, mockPaginationQuery)
      jest.spyOn(service, 'findAll').mockResolvedValue(findAllServices)

      const result = await controller.findAll(mockPaginationQuery)

      expect(result).toEqual(findAllServices)
      expect(service.findAll).toHaveBeenCalledTimes(1)
    })

    it('Should be possible to return an error', async () => {
      const error = new HttpException('Não há serviço disponívies!', HttpStatus.NOT_FOUND)
      jest.spyOn(service, 'findAll').mockRejectedValue(error)

      await expect(controller.findAll(mockPaginationQuery)).rejects.toEqual(error)

      expect(service.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('Service/controller/findById', () => {
    it('Should be possible to find a service by id', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(serviceByIdMock)

      const result = await controller.findById(serviceByIdMock.id)

      expect(result).toEqual(serviceByIdMock)
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(service.findById).toHaveBeenCalledWith(serviceByIdMock.id)
    })

    it('Should return error if service not found', async () => {
      const error = new HttpException('Serviço não encontrado!', HttpStatus.NOT_FOUND)

      jest.spyOn(service, 'findById').mockRejectedValue(error)

      await expect(controller.findById(999)).rejects.toThrow(error)

      expect(service.findById).toHaveBeenCalledTimes(1)
    })
  })
  describe('Service/controller/update', () => {
    it('Should be possible to update a service', async () => {
      const serviceData = serviceMock[0]

      jest.spyOn(service, 'update').mockResolvedValue(serviceData)

      const result = await controller.update(serviceData.id, {
        name: serviceData.name,
        price: serviceData.price,
        durationMinutes: serviceData.durationMinutes,
      })

      expect(result).toEqual(serviceData)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(serviceData.id, {
        name: serviceData.name,
        price: serviceData.price,
        durationMinutes: serviceData.durationMinutes,
      })
    })

    it('Should return error when update fails', async () => {
      const error = new HttpException('Não foi possível atualizar o serviço!', HttpStatus.NOT_FOUND)

      jest.spyOn(service, 'update').mockRejectedValue(error)

      await expect(
        controller.update(1, {
          name: '',
          price: '',
          durationMinutes: '',
        }),
      ).rejects.toThrow(error)

      expect(service.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('Service/controller/remove', () => {
    it('Should be possible to delete a service', async () => {
      const serviceData = serviceMock[0]

      jest.spyOn(service, 'delete').mockResolvedValue(serviceData)

      const result = await controller.remove(serviceData.id)

      expect(result).toEqual(serviceData)
      expect(service.delete).toHaveBeenCalledTimes(1)
      expect(service.delete).toHaveBeenCalledWith(serviceData.id)
    })

    it('Should return error when deleting fails', async () => {
      const error = new HttpException('Não foi possível deletar o serviço!', HttpStatus.NOT_FOUND)

      jest.spyOn(service, 'delete').mockRejectedValue(error)

      await expect(controller.remove(1)).rejects.toThrow(error)

      expect(service.delete).toHaveBeenCalledTimes(1)
    })
  })
})
