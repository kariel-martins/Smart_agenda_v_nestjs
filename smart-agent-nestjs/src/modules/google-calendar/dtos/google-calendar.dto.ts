// google-calendar/google-calendar.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEventDTO {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ example: "2026-03-25T10:00:00" })
  @IsISO8601()
  startDateTime: string;
  @ApiProperty({ example: "2026-03-25T11:00:00" })
  @IsISO8601()
  endDateTime: string;
  @ApiProperty({ example: "America/Sao_Paulo" }) @IsString() timeZone: string;
}
