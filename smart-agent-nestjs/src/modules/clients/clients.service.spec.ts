import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from 'src/prisma.service';
import { ExecuteHandler } from 'src/common/handlers/execute.handler';
import { RequestContextService } from 'src/common/services/request-context/request-context.service';
import { ClientMock } from './client.mock';
import { userServiceMock } from '../services/service.mock';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: PrismaService
   let requestContext: RequestContextService

  const clientMock = new ClientMock

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn()
            }
          }
        },
        {
          provide: RequestContextService,
          useValue: {
            getUser: jest.fn().mockReturnValue(userServiceMock)
          }
        },
        {
          provide: ExecuteHandler,
          useValue: {
            repository: jest.fn((fn) => fn())
          }
        }
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(PrismaService)
    requestContext = module.get<RequestContextService>(RequestContextService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create client successfully', async () => {
      jest.spyOn(prisma.client, 'create').mockResolvedValue(clientMock as any)

      const result = await service.create({ name: 'Client Test' } as any)

      expect(requestContext.getUser).toHaveBeenCalled()
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          businessId: userServiceMock.businessId,
          name: 'Client Test',
        },
      })
      expect(result).toEqual(clientMock)
    })

    it('should throw error when create fails', async () => {
      jest.spyOn(prisma.client, 'create').mockRejectedValue(new Error('DB Error'))

      await expect(service.create({ name: 'Client Test' } as any)).rejects.toThrow()
    })
  })

  describe('findById', () => {
    it('should return client', async () => {
      jest.spyOn(prisma.client, 'findFirst').mockResolvedValue(ClientMock as any)

      const result = await service.findById('client-1')

      expect(prisma.client.findFirst).toHaveBeenCalledWith({
        where: {
          businessId: userServiceMock.businessId,
          id: 'client-1',
        },
      })
      expect(result).toEqual(ClientMock)
    })

    it('should throw error when query fails', async () => {
      jest.spyOn(prisma.client, 'findFirst').mockRejectedValue(new Error())

      await expect(service.findById('client-1')).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should return paginated clients', async () => {
      jest.spyOn(prisma.client, 'findMany').mockResolvedValue([clientMock] as any)
      jest.spyOn(prisma.client, 'count').mockResolvedValue(1)

      const result = await service.findAll({ page: 1, limit: 10 } as any)

      expect(prisma.client.findMany).toHaveBeenCalled()
      expect(prisma.client.count).toHaveBeenCalledWith({
        where: {
          businessId: userServiceMock.businessId,
        },
      })

      expect(result.data).toBeDefined()
    })

    it('should throw error when findMany fails', async () => {
      jest.spyOn(prisma.client, 'findMany').mockRejectedValue(new Error())

      await expect(service.findAll()).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update client successfully', async () => {
      const updated = { ...clientMock, name: 'Updated' }

      jest.spyOn(prisma.client, 'update').mockResolvedValue(updated as any)

      const result = await service.update('client-1', { name: 'Updated' } as any)

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: {
          businessId: userServiceMock.businessId,
          id: 'client-1',
        },
        data: { name: 'Updated' },
      })

      expect(result).toEqual(updated)
    })

    it('should throw error when update fails', async () => {
      jest.spyOn(prisma.client, 'update').mockRejectedValue(new Error())

      await expect(
        service.update('client-1', { name: 'Updated' } as any),
      ).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should delete client successfully', async () => {
      jest.spyOn(prisma.client, 'delete').mockResolvedValue(clientMock as any)

      const result = await service.delete('client-1')

      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: {
          businessId: userServiceMock.businessId,
          id: 'client-1',
        },
      })

      expect(result).toEqual(clientMock)
    })

    it('should throw error when delete fails', async () => {
      jest.spyOn(prisma.client, 'delete').mockRejectedValue(new Error())

      await expect(service.delete('client-1')).rejects.toThrow()
    })
  })
})
