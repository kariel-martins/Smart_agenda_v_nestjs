import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

class AuthUserDTO {
  @ApiProperty() name: string
  @ApiProperty() email: string
  @ApiProperty() userRole: UserRole
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date | null
}

class RefreshTokenDTO {
  @ApiProperty() id: string
  @ApiProperty() userId: string
  @ApiProperty() tokenHash: string
  @ApiProperty() createdAt: Date
  @ApiProperty() expiresAt: Date | null
  @ApiProperty() revoked: boolean
}

export class SingUpWithConfirmPassword {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'business name' })
  @IsString()
  @IsNotEmpty()
  nameBusiness: string

  @ApiProperty({ description: 'User email' })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({ description: 'confirmPassword' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string
}

export class BusinessUserAndTokensDTO {
  @ApiProperty() id: string
  @ApiProperty() BusinessName: string
  @ApiProperty() slug: string | null
  @ApiProperty() phone: string | null
  @ApiProperty() email: string
  @ApiProperty() timezone: string
  @ApiProperty() createdAt: Date
  @ApiProperty({ type: AuthUserDTO })
  user: AuthUserDTO

  @ApiProperty() refreshToken: string
  @ApiProperty() accessToken: string
}

export class SignInDTO {
  @ApiProperty({ description: 'User email' })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}

export class SignInWithRefreshTokenReposnceDTO extends RefreshTokenDTO {
  accessToken: string
  refreshToken: string
}
