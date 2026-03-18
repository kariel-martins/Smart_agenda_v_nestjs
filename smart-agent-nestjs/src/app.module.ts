import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppointmentModule } from './modules/appointment/appointment.module'
import { AuthModule } from './modules/auth/auth.module'
import { AvailibilityModule } from './modules/availibility/availibility.module'
import { BusinessModule } from './modules/business/business.module'
import { ClientsModule } from './modules/clients/clients.module'
import { MailModule } from './modules/mail/mail.module'
import { MailService } from './modules/mail/mail.service'
import { NoShowRulesModule } from './modules/no-show-rules/no-show-rules.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { ProfessionalModule } from './modules/professional/professional.module'
import { ReportsModule } from './modules/reports/reports.module'
import { ServicesModule } from './modules/services/services.module'
import { UsersModule } from './modules/users/users.module'
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppointmentModule,
    AuthModule,
    ServicesModule,
    AvailibilityModule,
    BusinessModule,
    ClientsModule,
    NoShowRulesModule,
    ProfessionalModule,
    UsersModule,
    MailModule,
    NotificationsModule,
    ReportsModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
