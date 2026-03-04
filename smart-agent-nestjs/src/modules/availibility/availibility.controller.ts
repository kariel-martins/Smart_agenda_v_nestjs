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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles-guard/roles-guard.guard'
import { ValidateResoucesIdsInterceptor } from 'src/common/interceptors/validate-resouces-ids/validate-resouces-ids.interceptor'
import { AvailibilityService } from './availibility.service'
import { AvailabityRequestDTO, UpdateAvailabityRequestDTO } from './availibity.dto'

@Controller({
  version: '1',
  path: 'professional/:professionalId/availability',
})
@UseInterceptors(ValidateResoucesIdsInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.manager)
export class AvailibilityController {
  constructor(private readonly service: AvailibilityService) {}

  @Post()
  @ValidateResourcesIds()
  create(
    @Param('professionalId', ParseIntPipe) professionalId: number,
    @Body() data: AvailabityRequestDTO,
  ) {
    return this.service.create(professionalId, data)
  }

  @Get()
  @ValidateResourcesIds()
  getAll(@Param('professionalId', ParseIntPipe) professionalId: number) {
    return this.service.findAll(professionalId)
  }

  @Put(':availabityId')
  @ValidateResourcesIds()
  update(
    @Param('professionalId', ParseIntPipe) professionalId: number,
    @Param('availabityId', ParseIntPipe) availabityId: number,
    @Body() data: UpdateAvailabityRequestDTO,
  ) {
    return this.service.update(professionalId, availabityId, data)
  }

  @Delete(':availabityId')
  @ValidateResourcesIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('professionalId', ParseIntPipe) professionalId: number,
    @Param('availabityId', ParseIntPipe) availabityId: number,
  ) {
    return this.service.delete(professionalId, availabityId)
  }
}
