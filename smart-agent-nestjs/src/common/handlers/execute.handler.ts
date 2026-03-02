import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class ExecuteHandler {
  public async repository<T>(
    fn: () => Promise<T | null>,
    message: string,
    context?: string,
  ): Promise<T> {
    try {
      const result = await fn()

      if (!result)
        throw new HttpException(message, HttpStatus.NOT_FOUND, {
          description: context,
        })

      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email já cadastrado')
        }
      }
      if (error instanceof HttpException) throw error

      console.error(error.message)
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
