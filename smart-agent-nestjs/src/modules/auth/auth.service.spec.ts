import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'
import { MailService } from '../mail/mail.service'
import {
  mockedAccountRequest,
  mockedAccountRespocnce,
  mockedBusiness,
  mockedRefreshToken,
  mockedRefreshTokenUpdate,
  mockedSignin,
  mockedUser,
} from './auth.mock'
import { AuthService } from './auth.service'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let prisma: PrismaService
  let jwtService: JwtService
  let mailService: MailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (callback) => {
              return callback({
                user: {
                  create: jest.fn(),
                },
                business: {
                  create: jest.fn(),
                },
                refreshToken: {
                  create: jest.fn(),
                  updateMany: jest.fn(),
                },
              })
            }),
            user: {
              update: jest.fn(),
              create: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
            },
            business: {
              create: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('123'),
            verify: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendCreateAccount: jest.fn(),
            sendForgotPassword: jest.fn(),
            sendResetPassword: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    mailService = module.get<MailService>(MailService)
    prisma = module.get<PrismaService>(PrismaService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be possible to create an account.', async () => {
    jest.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => {
      return callback({
        business: {
          create: jest.fn().mockResolvedValue(mockedBusiness),
        },
        user: {
          create: jest.fn().mockResolvedValue(mockedUser),
        },
        refreshToken: {
          create: jest.fn().mockResolvedValue(mockedRefreshToken),
        },
      } as any)
    })

    const result = await service.signup(mockedAccountRequest)

    expect(result).toEqual(mockedAccountRespocnce)
  })

  it('Should be able to login with the correct credentials', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockedSignin)
    jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
      return callback({
        refreshToken: {
          updateMany: jest.fn().mockResolvedValue(mockedRefreshToken),
          create: jest.fn().mockResolvedValue(mockedRefreshToken),
        },
      } as any)
    })
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const result = await service.signIn({
      email: mockedUser.email,
      password: '123',
    })

    expect(result).toEqual(mockedAccountRespocnce)
  })

  it('Should be possible to refresh successfully', async () => {
    jest.spyOn(prisma.refreshToken, 'findFirst').mockResolvedValue(mockedRefreshToken)

    jest.spyOn(prisma.refreshToken, 'create').mockResolvedValue(mockedRefreshToken)

    jest.spyOn(prisma.refreshToken, 'update').mockResolvedValue(mockedRefreshTokenUpdate)

    jest.spyOn(jwtService, 'verify').mockReturnValue({
      sub: mockedUser.id,
      scope: mockedBusiness.id,
      id: mockedRefreshToken.id,
      purpose: 'refresh_token',
      token: '123',
    })

    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-token')

    const result = await service.refresh('123412345sdadfASDD')

    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
  })

  it('Should be possible to send the "forgot password" email.', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockedUser)
    jest.spyOn(mailService, 'sendForgotPassword').mockImplementation()

    const result = await service.forgotPassword(mockedUser.email)

    expect(result).toEqual('123')
  })

  it('Should be possible to reset the password.', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockedUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    jest.spyOn(mailService, 'sendResetPassword').mockImplementation()
    jest.spyOn(prisma.user, 'update').mockResolvedValue(mockedUser)
    jest
      .spyOn(jwtService, 'verify')
      .mockReturnValue({ sub: mockedUser.id, purpose: 'reset_password' })

    const result = await service.resetPassword({
      token: 'token',
      password: '123',
      confirmPassword: '123',
    })

    expect(result).toEqual(mockedUser)
  })
})
