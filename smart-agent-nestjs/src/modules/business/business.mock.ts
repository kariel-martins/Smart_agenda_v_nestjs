import { faker } from '@faker-js/faker'
import { userServiceMock } from '../services/service.mock'

export class BusinessMock {
  name = faker.company.name()
  id = userServiceMock.businessId
  createdAt = faker.date.anytime()
  slug = faker.lorem.sentence()
  phone = '6666666787089'
  email = faker.internet.email()
  active = faker.datatype.boolean()
  timezone = faker.location.timeZone()
}
