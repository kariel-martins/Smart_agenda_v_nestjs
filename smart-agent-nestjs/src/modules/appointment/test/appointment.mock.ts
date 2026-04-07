import { faker } from '@faker-js/faker/.'
import { AppointmentStatus } from '@prisma/client'

export class AppointmentMock {
  id = faker.number.int()
  businessId = 'businessId'
  createdAt = faker.date.anytime()
  professionalId = faker.number.int()
  clientId = faker.string.uuid()
  serviceId = faker.number.int()
  date = faker.string.numeric()
  startTime = faker.string.numeric()
  endTime = faker.string.numeric()
  status: AppointmentStatus = faker.helpers.enumValue(AppointmentStatus)
  cancelReason = faker.lorem.text()
  confirmAt = faker.date.anytime()
}
