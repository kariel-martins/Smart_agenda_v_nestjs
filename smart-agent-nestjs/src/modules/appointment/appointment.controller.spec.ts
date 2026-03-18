import { Test, TestingModule } from '@nestjs/testing'
import { AppointmentController } from './appointment.controller'
import { AppointmentService } from './appointment.service'

describe('AppointmentController', () => {
  let controller: AppointmentController
  let service: AppointmentService

  const mockAppointmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: mockAppointmentService,
        },
      ],
    }).compile()

    controller = module.get<AppointmentController>(AppointmentController)
    service = module.get<AppointmentService>(AppointmentService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call service.create', async () => {
      const dto: any = { date: '2026-01-01' }

      await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const query: any = { page: 1, limit: 10 }
      const params: any = { status: 'confirmed' }

      await controller.findAll(query, params)

      expect(service.findAll).toHaveBeenCalledWith(query, params)
    })
  })

  describe('confirm', () => {
    it('should update appointment to confirmed', async () => {
      await controller.confirm(1)

      expect(service.updateStatus).toHaveBeenCalledWith(1, {
        status: 'confirmed',
        confirmAt: new Date(),
      })
    })
  })

  describe('complete', () => {
    it('should update appointment to completed', async () => {
      await controller.complete(1)

      expect(service.updateStatus).toHaveBeenCalledWith(1, {
        status: 'completed',
      })
    })
  })

  describe('cancel', () => {
    it('should update appointment to canceled', async () => {
      const dto: any = { reason: 'client canceled' }

      await controller.cancel(1, dto)

      expect(service.updateStatus).toHaveBeenCalledWith(1, {
        status: 'canceled',
        ...dto,
      })
    })
  })

  describe('NoShow', () => {
    it('should update appointment to no_show', async () => {
      const dto: any = { note: 'client did not appear' }

      await controller.NoShow(1, dto)

      expect(service.updateStatus).toHaveBeenCalledWith(1, {
        status: 'no_show',
        ...dto,
      })
    })
  })
})
