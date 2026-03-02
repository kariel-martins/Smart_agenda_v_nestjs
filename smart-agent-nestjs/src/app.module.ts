import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServicesModule } from './modules/services/services.module';
import { AvailibilityModule } from './modules/availibility/availibility.module';
import { BusinessModule } from './modules/business/business.module';
import { ClientsModule } from './modules/clients/clients.module';
import { NoShowRulesModule } from './modules/no-show-rules/no-show-rules.module';
import { ProfessionalModule } from './modules/professional/professional.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './modules/mail/mail.service';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppointmentModule, AuthModule, ServicesModule, AvailibilityModule, BusinessModule, ClientsModule, NoShowRulesModule, ProfessionalModule, UsersModule, MailModule],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
