import { RequestContextService } from 'src/common/services/request-context/request-context.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  let requestContext: RequestContextService
  let guard : JwtAuthGuard
  let mockExecutionContext: ExecutionContext

  beforeEach(() => {
    requestContext = {
      setUser: jest.fn(),
    } as any

    guard = new JwtAuthGuard(requestContext)

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 1, username: 'testuser' },
        }),
      }),
    } as ExecutionContext
  })


  it('should return true and set user when authentication succeeds', async () => {
    const superCanActivate = jest.spyOn(AuthGuard('jwt').prototype, 'canActivate')
    superCanActivate.mockResolvedValue(true)

    const result = await guard.canActivate(mockExecutionContext)

    expect(result).toBe(true)
    expect(requestContext.setUser).toHaveBeenCalledWith({
      id: 1,
      username: 'testuser',
    })
  })

  it('should return false and not set user when authentication fails', async () => {
    const superCanActivate = jest.spyOn(AuthGuard('jwt').prototype, 'canActivate')
    superCanActivate.mockResolvedValue(false)

    const result = await guard.canActivate(mockExecutionContext)

    expect(result).toBe(false)
    expect(requestContext.setUser).not.toHaveBeenCalled()
  })

  it('should throw an error when super.canActivate throws', async () => {
    const error = new Error('Authentication failed')
    jest.spyOn(AuthGuard('jwt').prototype, 'canActivate').mockRejectedValue(error)

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(error)
    expect(requestContext.setUser).not.toHaveBeenCalled()
  })
})