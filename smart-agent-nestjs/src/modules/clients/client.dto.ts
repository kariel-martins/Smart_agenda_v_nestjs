import { ApiProperty } from '@nestjs/swagger'
import { AppointmentStatus } from '@prisma/client'
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class ClientDTO {
  @ApiProperty({ description: 'Client Name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Client phone' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: 'Client email' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'Client Name' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty({ description: 'Client Name' })
  @IsUUID()
  @IsNotEmpty()
  id: string

  @ApiProperty({ description: 'Client Name' })
  @IsUUID()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({ description: 'Client Name' })
  @IsNumber()
  noShowCount: number | null

  @ApiProperty({ description: 'Client Name' })
  @IsNumber()
  totalAppointments: number | null
}

export class ClientRequestDTO {
  @ApiProperty({ description: 'Client Name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Client phone' })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: 'Client email' })
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class UpdateClientRequestDTO {
  @ApiProperty({ description: 'Client Name' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: 'Client phone' })
  @IsString()
  @IsOptional()
  phone: string

  @ApiProperty({ description: 'Client email' })
  @IsEmail()
  @IsOptional()
  email: string
}

class AppointmentDTO { 
   @ApiProperty({
      description: 'Appointment status',
      enum: AppointmentStatus,
      default: AppointmentStatus.scheduled,
      required: false,
    })
    @IsEnum({ type: AppointmentStatus })
    @IsOptional()
    status?: AppointmentStatus
}
export class ClientWithAppointment extends ClientDTO {
  appointments: AppointmentDTO[]
}