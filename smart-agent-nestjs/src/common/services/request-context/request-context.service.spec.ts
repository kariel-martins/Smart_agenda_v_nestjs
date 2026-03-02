import { Test, TestingModule } from '@nestjs/testing'
import { RequestContextService } from './request-context.service'
import { User } from '@prisma/client'

describe('RequestContextService', () => {
  const service: RequestContextService = new RequestContextService()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestContextService],
    }).compile()
  })
  it('should set and return the user', () => {
    const mockUser = { id: 'user-1' } as unknown as User
    service.setUser(mockUser)
    expect(service.getUser()).toEqual(mockUser)
  })
  it('should return the user id', () => {
    const mockUser = { id: 'user-1' } as unknown as User
    service.setUser(mockUser)
    expect(service.getUserId()).toEqual('user-1')
  })
})
