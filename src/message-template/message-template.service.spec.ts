import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplateService } from './message-template.service';

describe('MessageTemplateService', () => {
  let service: MessageTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageTemplateService],
    }).compile();

    service = module.get<MessageTemplateService>(MessageTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
