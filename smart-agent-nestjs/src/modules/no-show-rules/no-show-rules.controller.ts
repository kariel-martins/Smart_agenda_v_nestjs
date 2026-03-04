import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles-guard/roles-guard.guard'
import { NoShowRuleRequestDTO, UpdateNoShowRuleRequestDTO } from './no-show-rules.dto'
import { NoShowRulesService } from './no-show-rules.service'

@Controller({
  version: '1',
  path: 'no-show-rules',
})

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.manager, UserRole.staff)
export class NoShowRulesController {
  constructor(private readonly service: NoShowRulesService) {}

  @Post()
  create(@Body() data: NoShowRuleRequestDTO) {
    return this.service.create(data)
  }

  @Get()
  getAll() {
    return this.service.findAll()
  }

  @Put('noShoewId')
  update(
    @Param('noShoewId', ParseUUIDPipe) noShoewId: number,
    @Body() data: UpdateNoShowRuleRequestDTO,
  ) {
    return this.service.update(noShoewId, data)
  }

  @Delete('noShoewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('noShoewId', ParseUUIDPipe) noShoewId: number) {
    return this.service.delete(noShoewId)
  }
}
