import { Test, TestingModule } from '@nestjs/testing';
import { NoShowRulesController } from './no-show-rules.controller';

describe('NoShowRulesController', () => {
  let controller: NoShowRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoShowRulesController],
    }).compile();

    controller = module.get<NoShowRulesController>(NoShowRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
