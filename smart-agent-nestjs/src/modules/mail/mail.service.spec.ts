import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailModule } from './mail.module';

describe('MailService', () => {
  let service: MailService;

  const mailMock = {
   EmailDate: {
        email: 'teste@teste.com',
        subject: 'teste'
      },
      pathRoute: 'mailTeste',
      UserName: 'mailMockTeste',
      token: 'tokenMock'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

   it('should be able to send the create account e-mail', async () => {
    jest.spyOn(service, 'sendCreateAccount').mockImplementation()
    await service.sendCreateAccount(mailMock.pathRoute, {
      email: mailMock.EmailDate.email,
      subject: mailMock.EmailDate.subject
    })
    expect(service.sendCreateAccount).toHaveBeenCalledTimes(1)
  })
  
   it('should be able to send the forgot password e-mail', async () => {
    jest.spyOn(service, 'sendForgotPassword').mockImplementation()
    await service.sendForgotPassword(mailMock)
    expect(service.sendForgotPassword).toHaveBeenCalledTimes(1)
  })

   it('should be able to send the reset password e-mail', async () => {
    jest.spyOn(service, 'sendResetPassword').mockImplementation()
    await service.sendResetPassword(mailMock)
    expect(service.sendResetPassword).toHaveBeenCalledTimes(1)
  })
});
