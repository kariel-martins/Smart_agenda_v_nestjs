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
  AppointmentRequestDTO,
  FindAppointmentsQueryDTO,
  UpdateAppointmentDTO,
} from './appointment.dto'
import { AppointmentService } from './appointment.service'

@Controller({
  version: '1',
  path: 'appointments',
})
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  create(@Body() data: AppointmentRequestDTO) {
    return this.service.create(data)
  }

  @Get()
  findAll(@Query() query: QueryPaginationDTO, @Query() params: FindAppointmentsQueryDTO) {
    return this.service.findAll(query, params)
  }

  @Patch(':appointmentId/confirm')
  confirm(@Param('appointmentId', ParseIntPipe) appointmentId: number) {
    return this.service.update(appointmentId, {
      status: 'confirmed',
    })
  }
  @Patch(':appointmentId/complete')
  complete(@Param('appointmentId', ParseIntPipe) appointmentId: number) {
    return this.service.update(appointmentId, {
      status: 'completed',
    })
  }
  @Patch(':appointmentId/cancel')
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
