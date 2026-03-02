import { Module } from '@nestjs/common';
import { AvailibilityController } from './availibility.controller';
import { AvailibilityService } from './availibility.service';

@Module({
  controllers: [AvailibilityController],
  providers: [AvailibilityService]
})
export class AvailibilityModule {}
