import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma.service'
import { BusinessController } from './business.controller'
import { BusinessModule } from './business.module'
import { BusinessService } from './business.service'

describe('BusinessController', () => {
  let controller: BusinessController
  let service: BusinessService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BusinessModule],
    })
      .overrideProvider(BusinessService)
      .useValue({
        findBusiness: jest.fn(),
        update: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile()

    controller = await module.resolve<BusinessController>(BusinessController)
    service = await module.resolve<BusinessService>(BusinessService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('get', () => {
    it('should return business profile', async () => {
      const businessMock = {
        id: '1',
        name: 'Business Test',
      }

      jest.spyOn(service, 'findBusiness').mockResolvedValue(businessMock as any)

      const result = await controller.get()

      expect(service.findBusiness).toHaveBeenCalledTimes(1)
      expect(result).toEqual(businessMock)
    })
  })

  describe('update', () => {
    it('should update and return business', async () => {
      const updateData = {
        name: 'Updated Business',
      }

      const updatedBusiness = {
        id: '1',
        ...updateData,
      }

      jest.spyOn(service, 'update').mockResolvedValue(updatedBusiness as any)

      const result = await controller.update(updateData as any)

      expect(service.update).toHaveBeenCalledTimes(1)
      expect(service.update).toHaveBeenCalledWith(updateData)
      expect(result).toEqual(updatedBusiness)
    })
  })
})
