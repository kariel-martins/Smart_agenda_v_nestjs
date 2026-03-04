import { Test, TestingModule } from '@nestjs/testing'
import bcrypt from 'bcrypt'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { mockedAccountRequest, mockedUser } from '../auth/auth.mock'
import { mockedFakerUserMultiple } from './user.mock'
import { UsersService } from './users.service'

jest.mock('bcrypt')

describe('UsersService', () => {
  let service: UsersService
  let execute: ExecuteHandler
  let prisma: PrismaService
  let requestContext: RequestContextService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: ExecuteHandler,
          useValue: {
            repository: jest.fn((fn) => fn()),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: RequestContextService,
          useValue: {
            getUser: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    prisma = module.get<PrismaService>(PrismaService)
    execute = module.get<ExecuteHandler>(ExecuteHandler)
    requestContext = module.get<RequestContextService>(RequestContextService)
  })

  it('Should to able create employees', async () => {
    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockedUser)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockedUser.passwordHash)
    jest.spyOn(requestContext, 'getUser').mockReturnValue(mockedUser)

    const result = await service.create({
      ...mockedAccountRequest,
      UserRole: 'staff',
    })

    expect(result).toEqual(mockedUser)
  })

  it('should seach for an employee', async () => {
    const user = mockedFakerUserMultiple[0]
    jest.spyOn(requestContext, 'getUser').mockReturnValue(user)

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(user)

    const result = await service.findById(user.id)

    expect(result).toEqual(user)
  })

  it('should seach for all employee', async () => {
    const user = mockedFakerUserMultiple[0]
    jest.spyOn(requestContext, 'getUser').mockReturnValue(user)

    jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockedFakerUserMultiple)

    const result = await service.findAll()

    expect(result).toEqual(mockedFakerUserMultiple)
  })

  it('should be update an employee', async () => {
    const user = mockedFakerUserMultiple[0]
    jest.spyOn(requestContext, 'getUser').mockReturnValue(user)

    jest.spyOn(prisma.user, 'update').mockResolvedValue(user)

    const result = await service.update(user.id, {
      email: user.email,
      name: user.name,
    })

    expect(result).toEqual(user)
  })

  it('should be delete an employee', async () => {
    const user = mockedFakerUserMultiple[0]
    jest.spyOn(requestContext, 'getUser').mockReturnValue(user)

    jest.spyOn(prisma.user, 'delete').mockResolvedValue(user)

    const result = await service.delete(user.id)

    expect(result).toEqual(user)
  })
})
