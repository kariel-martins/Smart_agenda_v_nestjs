import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response'
import { findQueryServiceDTO, ServiceRequestDTO, ServiceUpdateRequestDTO } from './services.dto'
import { ServicesService } from './services.service'

@Controller({
  version: '1',
  path: 'services',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.staff, UserRole.manager, UserRole.admin)
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Get()
  @ApiPaginatedResponse(ServiceRequestDTO)
  findAll(@Query() query?: QueryPaginationDTO, @Query() params?: findQueryServiceDTO) {
    return this.service.findAll(query, params)
  }

  @Post()
  create(@Body() data: ServiceRequestDTO) {
    return this.service.create(data)
  }

  @Get(':serviceId')
  findById(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.service.findById(serviceId)
  }

  @Put(':serviceId')
  update(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() data: ServiceUpdateRequestDTO,
  ) {
    return this.service.update(serviceId, data)
  }

  @Delete(':serviceId')
  remove(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.service.delete(serviceId)
  }
}
