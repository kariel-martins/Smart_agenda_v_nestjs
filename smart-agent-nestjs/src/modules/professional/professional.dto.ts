import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { AppointmentDTO } from '../appointment/appointment.dto'
import { AvailabityDTO } from '../availibility/availibity.dto'
import { ServiceDTO } from '../services/services.dto'

export class ProfessionalDTO {
  @ApiProperty({ description: 'Professional Id' })
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty({ description: 'Professional businessId' })
  @IsUUID()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({ description: 'Professional name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Professional specialty' })
  @IsString()
  @IsNotEmpty()
  specialty: string

  @ApiProperty({ description: 'Professional isActive' })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean

  @ApiProperty({ description: 'Professional createdAt' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date
}

export class ProfessionalRequestDTO {
  @ApiProperty({ description: 'Professional name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Professional specialty' })
  @IsString()
  @IsNotEmpty()
  specialty: string
}

export class UpdateProfessionalRequestDTO {
  @ApiProperty({ description: 'Professional name' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: 'Professional specialty' })
  @IsString()
  @IsOptional()
  specialty: string
}

export class findQueryProfessionalDTO {
  @ApiProperty({ description: 'Professional name' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: 'Professional specialty' })
  @IsString()
  @IsOptional()
  specialty?: string

  @ApiProperty({ description: 'Professional isActive' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}

class ServiceProfData {
  service: [ServiceDTO]
}

class clientName {
  @ApiProperty({ description: 'Client name' })
  name: string
}

class AppointmentProfessional extends AppointmentDTO {
  client: clientName
}

export class ProfessionalByIdResponce extends ProfessionalDTO {
  appointments: [AppointmentProfessional]
  availabilities: [AvailabityDTO]
  service: ServiceProfData
}
