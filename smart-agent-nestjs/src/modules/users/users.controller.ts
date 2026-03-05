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
import { UpdateUserDTO, UserDTO } from './users.dto'
import { UsersService } from './users.service'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'

@Controller({
  version: '1',
  path: 'users',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserDTO})
  findAll() {
    return this.service.findAll()
  }

  @Post()
  @ApiCreatedResponse({ type: UserDTO })
  create(@Body() data: UserDTO) {
    return this.service.create(data)
  }

  @Get(':userId')
  @ApiOkResponse({ type: UserDTO})
  findById(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findById(userId)
  }

  @Put(':userId')
  @ApiOkResponse({ type: UserDTO})
  update(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UpdateUserDTO) {
    return this.service.update(userId, data)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.delete(userId)
  }
}
