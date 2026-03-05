import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalController } from './professional.controller';
import { PrismaService } from 'src/prisma.service';
import { ProfessionalModule } from './professional.module';
import { ProfessionalService } from './professional.service';
import { ProfessionalMock } from './professional.mock';

describe('ProfessionalController', () => {
  let controller: ProfessionalController;
  let service: ProfessionalService

  const professionalMock = new ProfessionalMock

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProfessionalModule],
    })
    .overrideProvider(ProfessionalService)
    .useValue({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })
    .overrideProvider(PrismaService)
    .useValue({ $connect: jest.fn() })
    .compile();

    controller = await module.resolve<ProfessionalController>(ProfessionalController);
    service = await module.resolve<ProfessionalService>(ProfessionalService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

   describe('create', () => {
    it('should create professional', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(professionalMock as any)

      const result = await controller.create(professionalMock as any)

      expect(service.create).toHaveBeenCalledWith(professionalMock)
      expect(result).toEqual(professionalMock)
    })

    it('should throw error when service fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Create error'))

      await expect(controller.create(professionalMock as any)).rejects.toThrow('Create error')

      expect(service.create).toHaveBeenCalled()
    })
  })

  describe('getAll', () => {
    it('should return professionals list', async () => {
      const response = {
        data: [professionalMock],
        total: 1,
      }

      jest.spyOn(service, 'findAll').mockResolvedValue(response as any)

      const result = await controller.findAll()

      expect(service.findAll).toHaveBeenCalled()
      expect(result).toEqual(response)
    })

    it('should throw error when service fails', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Find error'))

      await expect(controller.findAll()).rejects.toThrow('Find error')

      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    it('should return professional by id', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(professionalMock as any)

      const result = await controller.findById(1)

      expect(service.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(professionalMock)
    })

    it('should throw error when professional not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new Error('Not found'))

      await expect(controller.findById(1)).rejects.toThrow('Not found')

      expect(service.findById).toHaveBeenCalledWith(1)
    })
  })

  describe('update', () => {
    it('should update professional', async () => {
      const updateData = { name: 'Updated Name' }

      jest.spyOn(service, 'update').mockResolvedValue({
        ...professionalMock,
        ...updateData,
      } as any)

      const result = await controller.update(1, updateData as any)

      expect(service.update).toHaveBeenCalledWith(1, updateData)
      expect(result).toEqual({
        ...professionalMock,
        ...updateData,
      })
    })

    it('should throw error when update fails', async () => {
      const updateData = { name: 'Updated Name' }

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Update error'))

      await expect(controller.update(1, updateData as any)).rejects.toThrow('Update error')

      expect(service.update).toHaveBeenCalledWith(1, updateData)
    })
  })

  describe('remove', () => {
    it('should delete professional', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(professionalMock)

      const result = await controller.remove(1)

      expect(service.delete).toHaveBeenCalledWith(1)
      expect(result).toEqual(professionalMock)
    })

    it('should throw error when delete fails', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Delete error'))

      await expect(controller.remove(1)).rejects.toThrow('Delete error')

      expect(service.delete).toHaveBeenCalledWith(1)
    })
  })
});
