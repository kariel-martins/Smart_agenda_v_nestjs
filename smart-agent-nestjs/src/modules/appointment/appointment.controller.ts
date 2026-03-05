import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'
import {
  AppointmentDTO,
  AppointmentRequestDTO,
  FindAppointmentsQueryDTO,
  UpdateAppointmentDTO,
} from './appointment.dto'
import { AppointmentService } from './appointment.service'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'

@Controller({
  version: '1',
  path: 'appointments',
})
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  @ApiCreatedResponse({ type: AppointmentDTO })
  create(@Body() data: AppointmentRequestDTO) {
    return this.service.create(data)
  }

  @Get()
  @ApiOkResponse({ type: AppointmentDTO })
  findAll(@Query() query: QueryPaginationDTO, @Query() params: FindAppointmentsQueryDTO) {
    return this.service.findAll(query, params)
  }

  @Patch(':appointmentId/confirm')
  @ApiOkResponse({ type: AppointmentDTO })
  confirm(@Param('appointmentId', ParseIntPipe) appointmentId: number) {
    return this.service.update(appointmentId, {
      status: 'confirmed',
    })
  }

  @Patch(':appointmentId/complete')
  @ApiOkResponse({ type: AppointmentDTO })
  complete(@Param('appointmentId', ParseIntPipe) appointmentId: number) {
    return this.service.update(appointmentId, {
      status: 'completed',
    })
  }

  @Patch(':appointmentId/cancel')
  @ApiOkResponse({ type: AppointmentDTO })
  cancel(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() data: UpdateAppointmentDTO,
  ) {
    return this.service.update(appointmentId, {
      status: 'canceled',
      ...data,
    })
  }

  @Patch(':appointmentId/no-show')
  @ApiOkResponse({ type: AppointmentDTO })
  NoShow(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() data: UpdateAppointmentDTO,
  ) {
    return this.service.update(appointmentId, {
      status: 'no_show',
      ...data,
    })
  }
}
