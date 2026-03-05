import { Reflector } from '@nestjs/core'
import { RolesGuard } from './roles-guard.guard'
import { ExecutionContext } from '@nestjs/common'
import { UserRole } from '@prisma/client'

function createMockExecutionContext(userRole?: UserRole): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user: {
          userRole,
        },
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext
}

describe('RoleGuardGuard', () => {
  let reflect: Reflector
  let mockExecutionContext: ExecutionContext

 describe('RolesGuard', () => {
  let guard: RolesGuard
  let reflector: Reflector

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any

    guard = new RolesGuard(reflector)
  })

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined)

    const context = createMockExecutionContext()

    expect(guard.canActivate(context)).toBe(true)
  })
    it('should allow access when user has required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.admin])

    const context = createMockExecutionContext(UserRole.admin)

    expect(guard.canActivate(context)).toBe(true)
  })
    it('should allow access when user has required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.admin])

    const context = createMockExecutionContext(UserRole.admin)

    expect(guard.canActivate(context)).toBe(true)
  })
    it('should deny access when user does not have required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.admin])

    const context = createMockExecutionContext(UserRole.staff)

    expect(guard.canActivate(context)).toBe(false)
  })
})
})