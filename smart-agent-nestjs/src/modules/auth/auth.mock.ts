import { UserRole } from '@prisma/client'

const nowDate = new Date()
const nowExpiresDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)

class MockedUser {
  public id = 'user_123'
  public email = 'joao@teste.com'
  public name = 'Joao'
  public passwordHash = 'user-123'
  public businessId = 'businessId_123'
  public userRole: UserRole = UserRole.admin
  public createdAt = nowDate
  public updatedAt = nowDate
}
export const mockedUser = new MockedUser()

class MockedBusiness {
  public id = 'business_123'
  public email = mockedUser.email
  public name = 'business'
  public createdAt = nowDate
  public slug = 'slug'
  public phone = '2134514454'
  public active = true
  public timezone = 'São paulo'
}

export const mockedBusiness = new MockedBusiness()

class MockedRefreshToken {
  public id = 'refresh_123'
  public createdAt = nowDate
  public userId = mockedUser.id
  public tokenHash = 'token_hash'
  public expiresAt = nowExpiresDate
  public revoked = false
}

export const mockedRefreshToken = new MockedRefreshToken()

class MockedRefreshTokenUpdate {
  public id = 'refresh_123'
  public createdAt = nowDate
  public userId = mockedUser.id
  public tokenHash = 'token_hash'
  public expiresAt = nowExpiresDate
  public revoked = true
}

export const mockedRefreshTokenUpdate = new MockedRefreshTokenUpdate()

class MockedSignin extends MockedUser {
  public business = new MockedBusiness()
}

export const mockedSignin = new MockedSignin()

export const mockedAccountRequest = {
  name: mockedUser.name,
  nameBusiness: mockedBusiness.name,
  email: mockedUser.email,
  confirmPassword: 'hash_password',
  password: 'hash_password',
}

export const mockedAccountRespocnce = {
  id: mockedBusiness.id,
  BusinessName: mockedBusiness.name,
  email: mockedBusiness.email,
  phone: mockedBusiness.phone,
  slug: mockedBusiness.slug,
  createdAt: mockedBusiness.createdAt,
  timezone: mockedBusiness.timezone,
  user: {
    name: mockedUser.name,
    email: mockedUser.email,
    userRole: mockedUser.userRole,
    createdAt: mockedUser.createdAt,
    updatedAt: mockedUser.updatedAt,
  },
  accessToken: '123',
  refreshToken: '123',
}
