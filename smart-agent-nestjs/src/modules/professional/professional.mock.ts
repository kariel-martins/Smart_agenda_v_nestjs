import { faker } from '@faker-js/faker'

export class ProfessionalMock {
  name = faker.person.fullName()
  id = faker.number.int()
  businessId: 'businessId'
  createdAt = faker.date.anytime()
  specialty = faker.person.jobArea()
  isActive = faker.datatype.boolean()
}
