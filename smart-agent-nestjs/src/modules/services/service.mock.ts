import { faker } from '@faker-js/faker'
import { AppointmentStatus, UserRole } from '@prisma/client'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination'

class UserMock {
  public id = faker.string.uuid()
  public email = faker.internet.email()
  public name = faker.person.fullName()
  public passwordHash = faker.internet.password()
  public businessId = 'businessId'
  public userRole: UserRole = faker.helpers.enumValue(UserRole)
  public createdAt = faker.date.anytime()
  public updatedAt = faker.date.anytime()
}

export const userServiceMock = new UserMock()

class ServiceMock {
  public name = faker.person.fullName()
  public id = faker.number.int()
  public businessId = userServiceMock.businessId
  public durationMinutes = faker.string.numeric()
  public price = faker.string.numeric()
  public createdAt = faker.date.anytime()
}

export const serviceMock = faker.helpers.multiple(() => new ServiceMock(), { count: 10 })

export const mockPaginationQuery: QueryPaginationDTO = { page: 1, size: 10 }

class appointmentsMock {
  createdAt = faker.date.anytime()
  date = faker.string.numeric()
  status: AppointmentStatus = faker.helpers.enumValue(AppointmentStatus)
}

class clientMock {
  name = faker.person.fullName()
  id = faker.string.uuid()
}

class appointmentsWithClientMock extends appointmentsMock {
  client = new clientMock()
}

class ServiceByIdMock extends ServiceMock {
  appointments = [new appointmentsWithClientMock()]
}

export const serviceByIdMock = new ServiceByIdMock()
