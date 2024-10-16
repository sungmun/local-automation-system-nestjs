import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplateController } from './message-template.controller';
import { MessageTemplateService } from './message-template.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';

describe('MessageTemplateController', () => {
  let controller: MessageTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageTemplateController],
      providers: [
        MessageTemplateService,
        {
          provide: getRepositoryToken(MessageTemplate),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MessageTemplateController>(
      MessageTemplateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
