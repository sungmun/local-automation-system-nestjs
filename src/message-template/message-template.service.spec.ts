import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplateService } from './message-template.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';

describe('MessageTemplateService', () => {
  let service: MessageTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageTemplateService,
        {
          provide: getRepositoryToken(MessageTemplate),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MessageTemplateService>(MessageTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
