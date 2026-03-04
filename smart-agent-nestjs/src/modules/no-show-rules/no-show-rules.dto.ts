import { ApiProperty } from '@nestjs/swagger'
import { NoShowAction } from '@prisma/client'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator'

export class NoShowRuleDTO {
  @ApiProperty({ description: 'no show rule createAt' })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date

  @ApiProperty({ description: 'no show rule createAt' })
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty({ description: 'no show rule createAt' })
  @IsNotEmpty()
  @IsUUID()
  businessId: string | null

  @ApiProperty({ description: 'no show rule createAt' })
  @IsNotEmpty()
  @IsNumber()
  maxRatePercent: number | null

  @ApiProperty({
    description: 'no show rule action',
    enum: NoShowAction,
    default: NoShowAction.block_booking,
    required: false,
  })
  @IsOptional()
  @IsEnum({ type: NoShowAction })
  action?: NoShowAction = NoShowAction.block_booking
}

export class NoShowRuleRequestDTO {
  @ApiProperty({ description: 'no show rule createAt' })
  @IsNotEmpty()
  @IsNumber()
  maxRatePercent: number | null

  @ApiProperty({
    description: 'no show rule action',
    enum: NoShowAction,
    default: NoShowAction.block_booking,
    required: false,
  })
  @IsOptional()
  @IsEnum({ type: NoShowAction })
  action?: NoShowAction = NoShowAction.block_booking
}

export class UpdateNoShowRuleRequestDTO {
  @ApiProperty({ description: 'no show rule createAt' })
  @IsOptional()
  @IsNumber()
  maxRatePercent: number | null

  @ApiProperty({
    description: 'no show rule action',
    enum: NoShowAction,
    default: NoShowAction.block_booking,
    required: false,
  })
  @IsOptional()
  @IsEnum({ type: NoShowAction })
  action?: NoShowAction = NoShowAction.block_booking
}
