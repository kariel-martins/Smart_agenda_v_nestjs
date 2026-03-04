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
import { UserRole } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles-guard/roles-guard.guard'
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response'
import {
  findQueryProfessionalDTO,
  ProfessionalDTO,
  ProfessionalRequestDTO,
  UpdateProfessionalRequestDTO,
} from './professional.dto'
import { ProfessionalService } from './professional.service'

@Controller({
  version: '1',
  path: 'professionals',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
export class ProfessionalController {
  constructor(private readonly service: ProfessionalService) {}

  @Get()
  @ApiPaginatedResponse(ProfessionalDTO)
  getAll(@Query() query?: QueryPaginationDTO, @Query() params?: findQueryProfessionalDTO) {
    return this.service.findAll(query, params)
  }

  @Post()
  create(@Body() data: ProfessionalRequestDTO) {
    return this.service.create(data)
  }

  @Get(':professionalId')
  getById(@Param('professionalId', ParseIntPipe) professionalId: number) {
    return this.service.finById(professionalId)
  }

  @Put(':professionalId')
  update(
    @Param('professionalId', ParseIntPipe) professionalId: number,
    @Body() data: UpdateProfessionalRequestDTO,
  ) {
    return this.service.update(professionalId, data)
  }

  @Delete(':professionalId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('professionalId', ParseIntPipe) professionalId: number) {
    return this.service.delete(professionalId)
  }
}
