import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDTO {
  @ApiProperty({ description: 'name professional' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'email professional' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({ description: 'User confirmPassword', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.admin,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  UserRole?: UserRole = UserRole.admin
}

export class UpdateUserDTO {
  @ApiProperty({ description: 'name professional' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: 'email professional' })
  @IsEmail()
  @IsOptional()
  email: string

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string

  @ApiProperty({ description: 'User confirmPassword', minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  confirmPassword: string

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.admin,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  UserRole?: UserRole = UserRole.admin
}
