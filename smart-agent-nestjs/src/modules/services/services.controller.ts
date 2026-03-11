import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles-guard/roles-guard.guard'
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response'
import {
  findQueryServiceDTO,
  findServiceByIdDTO,
  ServiceDTO,
  ServiceRequestDTO,
  ServiceUpdateRequestDTO,
} from './services.dto'
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
  @ApiCreatedResponse({ type: ServiceDTO })
  create(@Body() data: ServiceRequestDTO) {
    return this.service.create(data)
  }

  @Get(':serviceId')
  @ApiOkResponse({ type: findServiceByIdDTO })
  findById(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.service.findById(serviceId)
  }

  @Put(':serviceId')
  @ApiOkResponse({ type: ServiceDTO })
  update(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() data: ServiceUpdateRequestDTO,
  ) {
    return this.service.update(serviceId, data)
  }

  @Delete(':serviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.service.delete(serviceId)
  }
}
