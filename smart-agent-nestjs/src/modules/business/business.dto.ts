import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class BusinessReponseDTO {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Business slug' })
  @IsString()
  slug: string | null

  @ApiProperty({ description: 'Business phone' })
  @IsString()
  phone: string | null

  @ApiProperty({ description: 'Business email' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'Business active' })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean

  @ApiProperty({ description: 'Business timezome' })
  @IsString()
  @IsNotEmpty()
  timezone: string

  @ApiProperty({ description: 'Business createdAt' })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date
}

export class UpdateBusinessDTO {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Business slug' })
  @IsString()
  slug: string | null

  @ApiProperty({ description: 'Business phone' })
  @IsString()
  phone: string | null

  @ApiProperty({ description: 'Business email' })
  @IsEmail()
  @IsNotEmpty()
  email: string
}
