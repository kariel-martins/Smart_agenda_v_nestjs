import { ApiProperty } from '@nestjs/swagger'
import { AppointmentStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class AppointmentDTO {
  @ApiProperty({ description: 'Appointment createAt' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty({ description: 'Appointment id' })
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty({ description: 'Appointment businessId' })
  @IsUUID()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({ description: 'Appointment date' })
  @IsString()
  @IsNotEmpty()
  date: string

  @ApiProperty({ description: 'Appointment startTime' })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ description: 'Appointment endTime' })
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({
    description: 'Appointment status',
    enum: AppointmentStatus,
    default: AppointmentStatus.scheduled,
    required: false,
  })
  @IsEnum({ type: AppointmentStatus })
  @IsOptional()
  status?: AppointmentStatus | null

  @ApiProperty({ description: 'Appointment cancelReason' })
  @IsString()
  @IsOptional()
  cancelReason?: string | null

  @ApiProperty({ description: 'Appointment confirmAt' })
  @IsDate()
  @IsNotEmpty()
  confirmAt: Date | null

  @ApiProperty({ description: 'Appointment professionalId' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  professionalId: number

  @ApiProperty({ description: 'Appointment clientId' })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ description: 'Appointment serviceId' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  serviceId: number
}

export class AppointmentRequestDTO {
  @ApiProperty({ description: 'Appointment date' })
  @IsString()
  @IsNotEmpty()
  date: string

  @ApiProperty({ description: 'Appointment startTime' })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ description: 'Appointment endTime' })
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ description: 'Appointment cancelReason' })
  @IsString()
  @IsOptional()
  cancelReason?: string | null

  @ApiProperty({ description: 'Appointment professionalId' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  professionalId: number

  @ApiProperty({ description: 'Appointment clientId' })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ description: 'Appointment serviceId' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  serviceId: number
}

export class UpdateAppointmentDTO {
  @ApiProperty({ description: 'Appointment cancelReason' })
  @IsString()
  @IsOptional()
  cancelReason?: string | null

  @ApiProperty({
    description: 'Appointment status',
    enum: AppointmentStatus,
    default: AppointmentStatus.scheduled,
    required: false,
  })
  @IsEnum({ type: AppointmentStatus })
  @IsOptional()
  status?: AppointmentStatus | null
}

export class FindAppointmentsQueryDTO {
  date?: string
  status?: AppointmentStatus = AppointmentStatus.scheduled
  confirmAt?: Date
  createdAt?: Date
}
