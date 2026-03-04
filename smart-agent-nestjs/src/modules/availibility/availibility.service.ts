import { Injectable } from '@nestjs/common'
import { ExecuteHandler } from 'src/common/handlers/execute.handler'
import { PrismaService } from 'src/prisma.service'
import { AvailabityRequestDTO, UpdateAvailabityRequestDTO } from './availibity.dto'

@Injectable()
export class AvailibilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execute: ExecuteHandler,
  ) {}

  async create(professionalId: number, data: AvailabityRequestDTO) {
    return this.execute.repository(async () => {
      const availability = await this.prisma.availability.create({
        data: {
          professionalId,
          ...data,
        },
      })

      return availability
    }, 'Não foi possível registar o disponibilidade!')
  }

  async findAll(professionalId: number) {
    return this.execute.repository(async () => {
      const newAvailability = await this.prisma.availability.findMany({
        where: {
          professionalId,
        },
      })
      return newAvailability
    }, 'Não foi possível buscar o disponibilidade!')
  }

  async update(professionalId: number, availabilityId: number, data: UpdateAvailabityRequestDTO) {
    return this.execute.repository(async () => {
      const newAvailability = await this.prisma.availability.update({
        where: {
          id: availabilityId,
          professionalId,
        },
        data,
      })
      return newAvailability
    }, 'Não foi possível update o disponibilidade!')
  }
  async delete(professionalId: number, availabilityId: number) {
    return this.execute.repository(async () => {
      const newAvailability = await this.prisma.availability.delete({
        where: {
          id: availabilityId,
          professionalId,
        },
      })
      return newAvailability
    }, 'Não foi possível delete o disponibilidade!')
  }
}
