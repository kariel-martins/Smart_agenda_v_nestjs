import { HttpException, HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { mockedFakerFindByIdUser, mockedFakerUserMultiple } from './user.mock'
import { UsersController } from './users.controller'
import { UsersModule } from './users.module'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService
  let requestContext: RequestContextService

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(RequestContextService)
      .useValue(requestContext)
      .compile()

    controller = await module.resolve<UsersController>(UsersController)
    service = await module.resolve<UsersService>(UsersService)
    requestContext = await module.resolve<RequestContextService>(RequestContextService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Users/controller/create', () => {
    it('Should be possible to create an account with the correct credentials', async () => {
      const user = mockedFakerUserMultiple[0]
      jest.spyOn(service, 'create').mockResolvedValue(user)
      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)

      const result = await controller.create({
        name: user.name,
        email: user.email,
        password: 'admin@17',
        confirmPassword: 'admin@17',
        UserRole: user.userRole,
      })

      expect(result).toEqual(user)
      expect(service.create).toHaveBeenCalledTimes(1)
    })

    it('Should be possible to check if passwords are similar', async () => {
      const user = mockedFakerUserMultiple[0]
      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)
      const error = new HttpException('Senhas não coincidem', HttpStatus.NOT_FOUND)
      jest.spyOn(service, 'create').mockRejectedValue(error)

      await expect(
        controller.create({
          email: 'teste@email.com',
          name: 'joao',
          password: 'admin123',
          confirmPassword: 'admin3456',
        }),
      ).rejects.toThrow(error)
    })

    it('Should be possible to verify the validation', async () => {
      const user = mockedFakerUserMultiple[0]
      const error = {
        message: ['email should not be empty', 'email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      }
      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)
      jest.spyOn(service, 'create').mockRejectedValue(error)

      await expect(
        controller.create({
          email: '',
          password: 'admin1234',
          confirmPassword: 'admin1234',
          name: 'joao',
        }),
      ).rejects.toEqual(error)
    })

    it('Should check if the email already exists.', async () => {
      const error = new HttpException('Email já cadastrado', HttpStatus.CONFLICT)
      const user = mockedFakerUserMultiple[0]
      jest.spyOn(service, 'create').mockRejectedValue(error)
      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)

      await expect(
        controller.create({
          email: user.email,
          name: user.name,
          password: 'admin1234',
          confirmPassword: 'admin123',
          UserRole: user.userRole,
        }),
      ).rejects.toThrow(HttpException)
    })
  })

  describe('Users/controller/findById', () => {
    it('Should be possible to search for an employee by ID', async () => {
      const user = mockedFakerFindByIdUser[0]
      jest.spyOn(service, 'findById').mockResolvedValue(user)
      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)

      const result = await controller.findById(user.id)

      expect(result).toEqual(user)
      expect(service.findById).toHaveBeenCalledTimes(1)
    })

    it('Should be possible to verify if the employee exists', async () => {
      const error = new HttpException('Não foi possível buscar o usuário!', HttpStatus.NOT_FOUND)
      const user = mockedFakerFindByIdUser[0]

      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)
      jest.spyOn(service, 'findById').mockRejectedValue(error)

      await expect(controller.findById(user.id)).rejects.toThrow(HttpException)
      expect(service.findById).toHaveBeenCalledTimes(1)
    })
  })

  describe('Users/controller/findAll', () => {
    it('Should be possible to search for all users', async () => {
      const user = mockedFakerFindByIdUser[0]

      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)
      jest.spyOn(service, 'findAll').mockResolvedValue(mockedFakerUserMultiple)

      const result = await controller.findAll()

      expect(result).toEqual(result)
      expect(service.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('Users/controller/update', () => {
    it('Should be possible to update the employee', async () => {
      const user = mockedFakerFindByIdUser[0]

      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)
      jest.spyOn(service, 'update').mockResolvedValue(user)

      const result = await controller.update(user.id, {
        name: user.name,
        email: user.email,
        UserRole: user.userRole,
      })

      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result).toEqual(result)
    })
  })

  describe('Users/controller/delete', () => {
    it('Should be possible to delete the employee', async () => {
      const user = mockedFakerFindByIdUser[0]

      jest.spyOn(requestContext, 'getUser').mockReturnValue(user)
      jest.spyOn(service, 'delete').mockResolvedValue(user)

      const result = await controller.remove(user.id)

      expect(service.delete).toHaveBeenCalledTimes(1)
      expect(result).toEqual(result)
    })
  })
})
