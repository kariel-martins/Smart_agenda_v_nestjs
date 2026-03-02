import { Test, TestingModule } from '@nestjs/testing';
import { NoShowRulesService } from './no-show-rules.service';

describe('NoShowRulesService', () => {
  let service: NoShowRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoShowRulesService],
    }).compile();

    service = module.get<NoShowRulesService>(NoShowRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
