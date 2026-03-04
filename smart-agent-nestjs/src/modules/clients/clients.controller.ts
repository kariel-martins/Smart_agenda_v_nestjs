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
  Query,
  UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles-guard/roles-guard.guard'
import { ClientRequestDTO, FindQueryClientDTO, UpdateClientRequestDTO } from './client.dto'
import { ClientsService } from './clients.service'

@Controller({
  version: '1',
  path: 'clients',
})

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.manager, UserRole.staff)
export class ClientsController {
  constructor(private readonly service: ClientsService) {}
  @Get()
  getAll(@Query() query?: QueryPaginationDTO, @Query() params?: FindQueryClientDTO) {
    return this.service.findAll(query, params)
  }

  @Post()
  create(@Body() data: ClientRequestDTO) {
    return this.service.create(data)
  }

  @Get(':clientId')
  getById(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.service.findById(clientId)
  }

  @Put('clientId')
  update(@Param('clientId', ParseUUIDPipe) clientId: string, @Body() data: UpdateClientRequestDTO) {
    return this.service.update(clientId, data)
  }

  @Delete('clientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.service.delete(clientId)
  }
}
