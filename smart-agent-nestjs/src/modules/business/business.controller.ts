import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from 'src/common/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles-guard/roles-guard.guard'
import { BusinessReponseDTO, UpdateBusinessDTO } from './business.dto'
import { BusinessService } from './business.service'
import { ApiOkResponse } from '@nestjs/swagger'

@Controller({
  version: '1',
  path: 'business/profile',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
export class BusinessController {
  constructor(private readonly service: BusinessService) {}

  @Get()
  @ApiOkResponse({ type: BusinessReponseDTO })
  get() {
    return this.service.findBusiness()
  }

  @Put()
  @ApiOkResponse({ type: BusinessReponseDTO })
  update(@Body() data: UpdateBusinessDTO) {
    return this.service.update(data)
  }
}
