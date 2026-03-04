import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class ServiceDTO {
  @ApiProperty({ description: 'Service name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Service duration for minutes' })
  @IsString()
  @IsNotEmpty()
  durationMinutes: string

  @ApiProperty({ description: 'Service price' })
  @IsString()
  @IsNotEmpty()
  price: string

  @ApiProperty({ description: 'Service createdAt' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty({ description: 'Service id' })
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty({ description: 'Service businessId' })
  @IsUUID()
  @IsNotEmpty()
  businessId: string
}

export class ServiceRequestDTO {
  @ApiProperty({ description: 'Service name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Service duration for minutes' })
  @IsString()
  @IsNotEmpty()
  durationMinutes: string

  @ApiProperty({ description: 'Service price' })
  @IsString()
  @IsNotEmpty()
  price: string
}

export class ServiceUpdateRequestDTO {
  @ApiProperty({ description: 'Service name' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: 'Service duration for minutes' })
  @IsString()
  @IsOptional()
  durationMinutes: string

  @ApiProperty({ description: 'Service price' })
  @IsString()
  @IsOptional()
  price: string
}

export class findQueryServiceDTO {
  @ApiProperty({ description: 'Service name' })
  @IsString()
  @IsOptional()
  name: string
}
