import { Module } from '@nestjs/common';
import { NoShowRulesController } from './no-show-rules.controller';
import { NoShowRulesService } from './no-show-rules.service';

@Module({
  controllers: [NoShowRulesController],
  providers: [NoShowRulesService]
})
export class NoShowRulesModule {}
