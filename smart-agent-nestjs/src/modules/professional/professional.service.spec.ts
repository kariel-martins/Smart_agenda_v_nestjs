import { Test, TestingModule } from '@nestjs/testing'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { userServiceMock } from '../services/service.mock'
import { ProfessionalService } from './professional.service'
import { ProfessionalMock } from './professional.mock'

describe('ProfessionalService', () => {
  let service: ProfessionalService
  let prisma: PrismaService
  let requestContext: RequestContextService

  const professionalMock = new ProfessionalMock()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalService,
        {
          provide: PrismaService,
          useValue: {
            professional: {
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            }
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUser: jest.fn().mockReturnValue(userServiceMock),
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

    service = module.get<ProfessionalService>(ProfessionalService)
    prisma = module.get<PrismaService>(PrismaService)
    requestContext = module.get<RequestContextService>(RequestContextService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a professional', async () => {
      const data = {
        name: professionalMock.name,
        specialty: professionalMock.specialty
      }
      jest.spyOn(prisma.professional, 'create').mockResolvedValue(professionalMock as any)

      const result = await service.create(data)

      expect(requestContext.getUser).toHaveBeenCalled()
      expect(prisma.professional.create).toHaveBeenCalledWith({
        data: {
          businessId: userServiceMock.businessId,
          ...data,
        },
      })
      expect(result).toEqual(professionalMock)
    })
  })

  describe('findAll', () => {
    it('should return professionals with pagination', async () => {
      jest.spyOn(prisma.professional, 'findMany').mockResolvedValue([professionalMock] as any)
      jest.spyOn(prisma.professional, 'count').mockResolvedValue(1)

      const result = await service.findAll()

      expect(requestContext.getUser).toHaveBeenCalled()
      expect(prisma.professional.findMany).toHaveBeenCalled()
      expect(prisma.professional.count).toHaveBeenCalled()
      expect(result).toBeDefined()
    })
  })

  describe('finById', () => {
    it('should return a professional by id', async () => {
      jest.spyOn(prisma.professional, 'findFirst').mockResolvedValue(professionalMock as any)

      const result = await service.findById(1)

      expect(requestContext.getUser).toHaveBeenCalled()
      expect(prisma.professional.findFirst).toHaveBeenCalledWith({
        where: {
          businessId: userServiceMock.businessId,
          id: 1,
        },
      })
      expect(result).toEqual(professionalMock)
    })
  })

  describe('update', () => {
    it('should update a professional', async () => {
      const updateData = { name: 'Updated Professional' }

      jest.spyOn(prisma.professional, 'update').mockResolvedValue({
        ...professionalMock,
        ...updateData,
      } as any)

      const result = await service.update(1, updateData as any)

      expect(requestContext.getUser).toHaveBeenCalled()
      expect(prisma.professional.update).toHaveBeenCalledWith({
        where: {
          businessId: userServiceMock.businessId,
          id: 1,
        },
        data: updateData,
      })
      expect(result).toEqual({
        ...professionalMock,
        ...updateData,
      })
    })
  })

  describe('delete', () => {
    it('should delete a professional', async () => {
      jest.spyOn(prisma.professional, 'delete').mockResolvedValue(professionalMock as any)

      const result = await service.delete(1)

      expect(requestContext.getUser).toHaveBeenCalled()
      expect(prisma.professional.delete).toHaveBeenCalledWith({
        where: {
          businessId: userServiceMock.businessId,
          id: 1,
        },
      })
      expect(result).toEqual(professionalMock)
    })
  })
})
