import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplateController } from './message-template.controller';
import { MessageTemplateService } from './message-template.service';

describe('MessageTemplateController', () => {
  let controller: MessageTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageTemplateController],
      providers: [MessageTemplateService],
    }).compile();

    controller = module.get<MessageTemplateController>(MessageTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
