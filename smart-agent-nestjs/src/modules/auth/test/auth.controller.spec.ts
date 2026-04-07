import { HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { AuthController } from './auth.controller'
import { mockedAccountRequest, mockedAccountRespocnce, mockedUser } from './auth.mock'
import { AuthModule } from './auth.module'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(service)
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn().mockReturnValue('123'),
        verify: jest.fn(),
      })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockReturnValue('test-secret'),
      })
      .overrideProvider(RequestContextService)
      .useValue({
        getUseId: jest.fn().mockReturnValue('user-1'),
      })
      .compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  describe('signup', () => {
    it('Should be possible to create an account', async () => {
      const responseMock = {
        cookie: jest.fn(),
      }
      jest.spyOn(service, 'signup').mockResolvedValue(mockedAccountRespocnce)

      const response = await controller.singUp(mockedAccountRequest, responseMock as any)

      expect(response).toEqual(mockedAccountRespocnce)
      expect(service.signup).toHaveBeenCalledTimes(1)
    })

    it('Should check if the passwords are the same', async () => {
      const error = new HttpException('Senhas não coincidem!', HttpStatus.CONFLICT)
      const responseMock = {
        cookie: jest.fn(),
      }
      jest.spyOn(service, 'signup').mockRejectedValue(error)

      await expect(
        controller.singUp(
          {
            ...mockedAccountRequest,
            password: 'admin@12345',
            confirmPassword: 'aidnm@1345',
          },
          responseMock as any,
        ),
      ).rejects.toThrow(HttpException)

      expect(service.signup).toHaveBeenCalledTimes(1)
    })

    it('Should check if the email or business name already exists.', async () => {
      const error = new HttpException('Email já cadastrado', HttpStatus.CONFLICT)
      const responseMock = {
        cookie: jest.fn(),
      }
      jest.spyOn(service, 'signup').mockRejectedValue(error)

      await expect(
        controller.singUp(
          {
            ...mockedAccountRequest,
            email: 'existing@email.com',
          },
          responseMock as any,
        ),
      ).rejects.toThrow('Email já cadastrado')

      expect(service.signup).toHaveBeenCalledTimes(1)
    })
  })

  describe('signin', () => {
    it('Should log in with the correct credentials', async () => {
      const responseMock = {
        cookie: jest.fn(),
      }
      jest.spyOn(service, 'signIn').mockResolvedValue(mockedAccountRespocnce)

      const result = await controller.singin(
        {
          email: mockedAccountRequest.email,
          password: mockedAccountRequest.password,
        },
        responseMock as any,
      )

      expect(result).toEqual(mockedAccountRespocnce)
      expect(service.signIn).toHaveBeenCalledTimes(1)
    })

    it('Should check if the email exists', async () => {
      const responseMock = {
        cookie: jest.fn(),
      }

      const error = new HttpException('Usuário invalido!', HttpStatus.NOT_FOUND)

      jest.spyOn(service, 'signIn').mockRejectedValue(error)

      await expect(
        controller.singin(
          {
            email: mockedAccountRequest.email,
            password: mockedAccountRequest.password,
          },
          responseMock as any,
        ),
      ).rejects.toThrow('Usuário invalido!')
      expect(service.signIn).toHaveBeenCalledTimes(1)
    })
  })

  describe('refresh', () => {
    it('Should check if this resets the authentication', async () => {
      const requestMock = {
        cookies: {
          refresh_token: 'token-123',
        },
      }

      const responseMock = {
        cookie: jest.fn(),
      }

      const authMock = {
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
      }

      jest.spyOn(service, 'refresh').mockResolvedValue(authMock)

      const result = await controller.refresh(requestMock as any, responseMock as any)

      expect(service.refresh).toHaveBeenCalledWith('token-123')

      expect(responseMock.cookie).toHaveBeenCalledTimes(2)

      expect(result).toEqual(authMock)
    })
  })

  describe('forgot-password', () => {
    it('Should send reset email successfully', async () => {
      jest.spyOn(service, 'forgotPassword').mockResolvedValue('123')

      const result = await controller.forgotPassword({
        email: mockedAccountRequest.email,
      })

      expect(service.forgotPassword).toHaveBeenCalledWith(mockedAccountRequest.email)

      expect(result).toEqual({
        message: 'Email enviar com sucesso!',
      })
    })

    it('Should throw error if service fails', async () => {
      const error = new HttpException('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR)

      jest.spyOn(service, 'forgotPassword').mockRejectedValue(error)

      await expect(
        controller.forgotPassword({
          email: mockedAccountRequest.email,
        }),
      ).rejects.toThrow(HttpException)

      expect(service.forgotPassword).toHaveBeenCalledTimes(1)
    })
  })

  describe('reset-password', () => {
    it('Should reset password successfully', async () => {
      jest.spyOn(service, 'resetPassword').mockResolvedValue(mockedUser)

      const result = await controller.resetPassword({
        token: 'token-123',
        password: 'novaSenha@123',
      })

      expect(service.resetPassword).toHaveBeenCalledTimes(1)

      expect(result).toEqual({
        message: 'Senha atualizada com sucesso!',
      })
    })

    it('Should throw error if service returns false', async () => {
      const error = new HttpException(
        'Não possível atualizar a senha!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
      jest.spyOn(service, 'resetPassword').mockRejectedValue(error)

      await expect(
        controller.resetPassword({
          token: 'token-123',
          password: 'novaSenha@123',
          confirmPassword: 'novaSenha@12',
        }),
      ).rejects.toThrow(HttpException)

      expect(service.resetPassword).toHaveBeenCalledTimes(1)
    })
  })

  describe('logout', () => {
    it('Should clear access token cookie', () => {
      const responseMock = {
        clearCookie: jest.fn(),
      }

      const result = controller.logout(responseMock as any)

      expect(responseMock.clearCookie).toHaveBeenCalledWith('access_token')

      expect(result).toEqual({
        message: 'Logout realizado com sucesso!',
      })
    })
  })
})
