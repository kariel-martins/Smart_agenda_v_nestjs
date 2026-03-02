import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { PrismaService } from 'src/prisma.service'
import { MailService } from '../mail/mail.service'
import { BusinessUserAndTokensDTO, SignInDTO, SingUpWithConfirmPassword } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly execute: ExecuteHandler,
  ) {}

  public async signup(data: SingUpWithConfirmPassword): Promise<BusinessUserAndTokensDTO> {
    return this.execute.repository(async () => {
      if (data.password !== data.confirmPassword)
        throw new HttpException('Senhas não coincidem!', HttpStatus.CONFLICT)

      const EXPIRES_IN_TWO_DAYS = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      const HASH_PASSWORD = await bcrypt.hash(data.password, 12)
      const randomIdToken = crypto.randomUUID()

      const result = await this.prisma.$transaction(async (tx) => {
        const newBusiness = await tx.business.create({
          data: {
            email: data.email,
            name: data.nameBusiness,
          },
        })

        if (!newBusiness)
          throw new HttpException('Não foi possivel criar o negócio', HttpStatus.NOT_FOUND)

        const newUser = await tx.user.create({
          data: {
            email: data.email,
            name: data.name,
            passwordHash: HASH_PASSWORD,
            businessId: newBusiness.id,
          },
        })

        if (!newUser)
          throw new HttpException('Não foi possivel criar o usuário', HttpStatus.NOT_FOUND)

        const HASH_REFRESH_TOKEN = await bcrypt.hash(randomIdToken, 12)

        const newRefreshToekn = await tx.refreshToken.create({
          data: {
            tokenHash: HASH_REFRESH_TOKEN,
            expiresAt: EXPIRES_IN_TWO_DAYS,
            userId: newUser.id,
          },
        })

        return {
          newBusiness,
          newUser,
          newRefreshToekn,
        }
      })

      if (!result) throw new HttpException('Não foi possível criar a contar', HttpStatus.NOT_FOUND)

      const refreshToken = this.jwtService.sign(
        {
          sub: result.newUser.id,
          scope: result.newBusiness.id,
          id: result.newRefreshToekn.id,
          token: randomIdToken,
          purpose: 'refresh_token',
        },
        { expiresIn: '2d' },
      )

      const accessToken = this.jwtService.sign(
        {
          sub: result.newUser.id,
          scope: result.newBusiness.id,
          purpose: 'access_token',
        },
        { expiresIn: '15m' },
      )

      this.mailService.sendCreateAccount('/auth/signin', {
        email: result.newUser.email,
        subject: 'Create Account',
      })

      return {
        id: result.newBusiness.id,
        BusinessName: result.newBusiness.name,
        email: result.newBusiness.email,
        phone: result.newBusiness.phone,
        slug: result.newBusiness.slug,
        createdAt: result.newBusiness.createdAt,
        timezone: result.newBusiness.timezone,
        user: {
          name: result.newUser.name,
          email: result.newUser.email,
          userRole: result.newUser.userRole,
          createdAt: result.newUser.createdAt,
          updatedAt: result.newUser.updatedAt,
        },
        accessToken,
        refreshToken,
      } as BusinessUserAndTokensDTO
    }, 'Não foi possível criar a sua conta!')
  }

  public async signIn(data: SignInDTO): Promise<BusinessUserAndTokensDTO> {
    return this.execute.repository(async () => {
      const randomIdToken = crypto.randomUUID()

      const isValidUser = await this.prisma.user.findFirst({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          name: true,
          updatedAt: true,
          passwordHash: true,
          createdAt: true,
          userRole: true,
          business: {
            select: {
              active: true,
              email: true,
              createdAt: true,
              name: true,
              id: true,
              phone: true,
              timezone: true,
              slug: true,
            },
          },
        },
      })

      if (!isValidUser || !bcrypt.compare(data.password, isValidUser.passwordHash))
        throw new HttpException('Usuário invalido!', HttpStatus.NOT_FOUND)

      const validationTokenRefresh = await this.prisma.$transaction(async (tx) => {
        await tx.refreshToken.updateMany({
          where: {
            userId: isValidUser.id,
          },
          data: {
            revoked: true,
          },
        })
        const HASH_REFRESH_TOKEN = await bcrypt.hash(randomIdToken, 12)
        return await tx.refreshToken.create({
          data: {
            tokenHash: HASH_REFRESH_TOKEN,
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            userId: isValidUser.id,
          },
        })
      })

      const refreshToken = this.jwtService.sign(
        {
          sub: isValidUser.id,
          scope: isValidUser.business.id,
          id: validationTokenRefresh.id,
          token: randomIdToken,
          purpose: 'refresh_token',
        },
        { expiresIn: '2d' },
      )

      const accessToken = this.jwtService.sign(
        {
          sub: isValidUser.id,
          scope: isValidUser.business.id,
          purpose: 'access_token',
        },
        { expiresIn: '15m' },
      )

      return {
        id: isValidUser.business.id,
        BusinessName: isValidUser.business.name,
        email: isValidUser.business.email,
        phone: isValidUser.business.phone,
        slug: isValidUser.business.slug,
        createdAt: isValidUser.business.createdAt,
        timezone: isValidUser.business.timezone,
        user: {
          name: isValidUser.name,
          email: isValidUser.email,
          userRole: isValidUser.userRole,
          createdAt: isValidUser.createdAt,
          updatedAt: isValidUser.updatedAt,
        },
        accessToken,
        refreshToken,
      } as BusinessUserAndTokensDTO
    }, 'Não foi possível autenticar o usuário!')
  }

  public async refresh(token: string) {
    return this.execute.repository(async () => {
      if (!token) throw new UnauthorizedException()
      const payload = this.jwtService.verify(token)

      if (
        !payload ||
        !payload.sub ||
        !payload.scope ||
        !payload.id ||
        payload.purpose !== 'refresh_token'
      ) {
        throw new UnauthorizedException()
      }

      const currentToken = await this.prisma.refreshToken.findFirst({
        where: {
          id: payload.id,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
        select: {
          id: true,
          userId: true,
          tokenHash: true,
        },
      })

      if (!currentToken) {
        throw new UnauthorizedException()
      }

      const isValid = await bcrypt.compare(payload.token, currentToken.tokenHash)
      if (!isValid) {
        await this.prisma.refreshToken.update({
          where: { id: currentToken.id },
          data: { revoked: true },
        })
        throw new UnauthorizedException()
      }

      const resultUpdateToken = await this.prisma.refreshToken.update({
        where: { id: currentToken.id },
        data: { revoked: true },
      })

      if (!resultUpdateToken) throw new UnauthorizedException()

      const randomIdToken = crypto.randomUUID()
      const HASH_REFRESH_TOKEN = await bcrypt.hash(randomIdToken, 12)

      const newRefreshToken = await this.prisma.refreshToken.create({
        data: {
          tokenHash: HASH_REFRESH_TOKEN,
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          userId: payload.sub,
          revoked: false,
        },
        include: {
          user: {
            select: {
              businessId: true,
            },
          },
        },
      })

      if (!newRefreshToken) throw new UnauthorizedException()

      const refreshToken = this.jwtService.sign(
        {
          sub: newRefreshToken.userId,
          scope: newRefreshToken.user.businessId,
          id: newRefreshToken.id,
          token: randomIdToken,
          purpose: 'refresh_token',
        },
        { expiresIn: '2d' },
      )

      const accessToken = this.jwtService.sign(
        {
          sub: newRefreshToken.userId,
          scope: newRefreshToken.user.businessId,
          purpose: 'access_token',
        },
        { expiresIn: '15m' },
      )

      return { accessToken, refreshToken }
    }, 'Não foi possível autenticar')
  }

  public async forgotPassword(email: string) {
    return this.execute.repository(async () => {
      const findUser = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      if (!findUser) throw new HttpException('Não possível buscar pelo email', HttpStatus.NOT_FOUND)

      const resetPasswordToken = this.jwtService.sign({
        sub: findUser.id,
        purpose: 'reset_password',
      })

      if (!resetPasswordToken) throw new UnauthorizedException()

      this.mailService.sendForgotPassword({
        UserName: findUser.name,
        pathRoute: '/auth/reset-password',
        token: resetPasswordToken,
        EmailDate: {
          email: findUser.email,
          subject: 'Reset Password',
        },
      })
      return resetPasswordToken
    }, 'Não possível buscar pelo email')
  }

  public async resetPassword(data: any) {
    return this.execute.repository(async () => {
      if (data.password !== data.confirmPassword)
        throw new HttpException('Senhas não coincidem!', HttpStatus.CONFLICT)

      const payload = await this.jwtService.verify(data.token)

      if (!payload || !payload.sub || payload.purpose !== 'reset_password')
        throw new UnauthorizedException()

      const findUser = await this.prisma.user.findFirst({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
        },
      })

      if (!findUser)
        throw new HttpException('Não possível buscar pelo Usuário', HttpStatus.NOT_FOUND)

      const HASH_PASSWORD = await bcrypt.hash(data.password)

      this.mailService.sendResetPassword({
        UserName: findUser.name,
        pathRoute: '/auth/signin',
        EmailDate: {
          email: findUser.email,
          subject: findUser.name,
        },
      })

      return await this.prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          passwordHash: HASH_PASSWORD,
        },
      })
    }, 'Não possível atualizar a senha!')
  }
}
