import { faker } from '@faker-js/faker/.'

export class availabityMock {
  id = faker.number.int()
  professionalId = faker.number.int()
  startTime = faker.string.numeric()
  endTime = faker.string.numeric()
  dayOfWeek = faker.date.weekday()
}
