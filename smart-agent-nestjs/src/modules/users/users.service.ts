import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { UpdateUserDTO, UserDTO } from './users.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly execute: ExecuteHandler,
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  public create(data: UserDTO) {
    const user = this.requestContext.getUser()
    return this.execute.repository(
      async () => {
        if (data.password !== data.confirmPassword)
          throw new HttpException('Senhas não coincidem', HttpStatus.NOT_FOUND)

        const passwordHash = await bcrypt.hash(data.password, 12)
        const result = this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            userRole: data.UserRole,
            passwordHash,
            businessId: user.businessId,
          },
          select: {
            name: true,
            email: true,
            userRole: true,
            createdAt: true,
            updatedAt: true,
          },
        })
        return result
      },
      'Não foi possível criar o usuário!',
      'users/users.services/create',
    )
  }

  public findById(userId: string) {
    return this.execute.repository(
      async () => {
        const user = this.requestContext.getUser()
        const result = this.prisma.user.findFirst({
          where: {
            id: userId,
            businessId: user.businessId,
          },
          include: {
            business: {
              select: {
                active: true,
                name: true,
                email: true,
                createdAt: true,
                id: true,
                phone: true,
              },
            },
          },
        })
        return result
      },
      'Não foi possível buscar o usuário!',
      'users/users.services/findById',
    )
  }

  public findAll() {
    return this.execute.repository(
      async () => {
        const user = this.requestContext.getUser()
        const result = await this.prisma.user.findMany({
          where: {
            businessId: user.businessId,
          },
          select: {
            id: true,
            name: true,
            userRole: true,
            createdAt: true,
          },
        })
        return result
      },
      'Não há usuário disponíveis!',
      'users/users.services/findAll',
    )
  }

  public update(userId: string, data: UpdateUserDTO) {
    return this.execute.repository(
      async () => {
        const user = this.requestContext.getUser()

        if (data.password !== data.confirmPassword)
          throw new HttpException('Senhas não coincidem', HttpStatus.NOT_FOUND)
        const passwordHash = await bcrypt.hash(data.password, 12)
        const result = await this.prisma.user.update({
          where: {
            id: userId,
            businessId: user.businessId,
          },
          data: {
            email: data.email,
            name: data.name,
            userRole: data.UserRole,
            passwordHash,
            businessId: user.businessId,
          },
        })
        return result
      },
      'Não foi possível atualizar o usuário!',
      'users/users.services/update',
    )
  }

  public delete(userId: string) {
    return this.execute.repository(
      async () => {
        const user = this.requestContext.getUser()
        const result = await this.prisma.user.delete({
          where: {
            id: userId,
            businessId: user.businessId,
          },
          select: {
            id: true,
            name: true,
            userRole: true,
            createdAt: true,
          },
        })
        return result
      },
      'Não foi possível remove o usuário!',
      'users/users.services/delete',
    )
  }
}
