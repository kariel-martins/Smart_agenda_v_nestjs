import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class AvailabityDTO {
  @ApiProperty({ description: 'avalibity id' })
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty({ description: 'avalibity professionalId' })
  @IsNumber()
  @IsNotEmpty()
  professionalId: number

  @ApiProperty({ description: 'avalibity dayOfWeek' })
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string

  @ApiProperty({ description: 'avalibity startTime' })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ description: 'avalibity endTime' })
  @IsString()
  @IsNotEmpty()
  endTime: string
}

export class AvailabityRequestDTO {
  @ApiProperty({ description: 'avalibity dayOfWeek' })
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string

  @ApiProperty({ description: 'avalibity startTime' })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ description: 'avalibity endTime' })
  @IsString()
  @IsNotEmpty()
  endTime: string
}

export class UpdateAvailabityRequestDTO {
  @ApiProperty({ description: 'avalibity dayOfWeek' })
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string

  @ApiProperty({ description: 'avalibity startTime' })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ description: 'avalibity endTime' })
  @IsString()
  @IsNotEmpty()
  endTime: string
}
