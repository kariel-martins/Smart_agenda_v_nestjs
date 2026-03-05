import { faker } from '@faker-js/faker'
import { userServiceMock } from '../services/service.mock'

export class ClientMock {
  name = faker.person.fullName()
  id = faker.string.uuid()
  businessId = userServiceMock.businessId
  createdAt = faker.date.anytime()
  phone = '99999999'
  email = faker.internet.email()
  noShowCount = faker.number.int()
  totalAppointments = faker.number.int()
}
