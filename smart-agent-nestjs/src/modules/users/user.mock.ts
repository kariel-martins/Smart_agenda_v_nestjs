import { faker } from '@faker-js/faker'
import { User, UserRole } from '@prisma/client'

const businessId = faker.string.uuid()

class MockedFakerBusiness {
  public active = faker.datatype.boolean()
  public name = faker.person.fullName()
  public email = faker.internet.email()
  public createdAt = faker.date.anytime()
  public id = businessId
  public phone = '9999999900'
}

class MockedFakerUser {
  public id = faker.string.uuid()
  public email = faker.internet.email()
  public name = faker.person.fullName()
  public passwordHash = 'user-123'
  public businessId = businessId
  public userRole: UserRole = faker.helpers.enumValue(UserRole)
  public createdAt = faker.date.anytime()
  public updatedAt = new Date()
}

export const mockedFakerUserMultiple = faker.helpers.multiple<User>(() => new MockedFakerUser())

class MockedFakerFindByIdUser extends MockedFakerUser {
  business: MockedFakerBusiness
}

export const mockedFakerFindByIdUser = faker.helpers.multiple<MockedFakerFindByIdUser>(
  () => new MockedFakerFindByIdUser(),
)
