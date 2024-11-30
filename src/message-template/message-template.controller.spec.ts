import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplateController } from './message-template.controller';
import { MessageTemplateService } from './message-template.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';
import { plainToInstance } from 'class-transformer';
import { MessageTemplateResponseDto } from './dto/response/message-template-response.dto';
import { ListMessageTemplateResponseDto } from './dto/response';

describe('MessageTemplateController', () => {
  let controller: MessageTemplateController;
  let service: MessageTemplateService;

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
    service = module.get<MessageTemplateService>(MessageTemplateService);
  });

  it('컨트롤러가 정의되어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('새로운 메시지 템플릿을 생성해야 한다', async () => {
      const dto = { name: '테스트', body: '본문', title: '제목', type: '유형' };
      jest.spyOn(service, 'create').mockResolvedValue(dto as any);

      const result = await controller.create(dto);
      expect(result).toEqual(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('모든 메시지 템플릿을 반환해야 한다', async () => {
      const templates = {
        list: [
          plainToInstance(MessageTemplateResponseDto, {
            id: '1',
            name: '테스트',
          }),
        ],
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(templates as any);

      const result = await controller.findAll();
      expect(result).toBeInstanceOf(ListMessageTemplateResponseDto);
      expect(result).toHaveProperty('list');
      // console.log(result.list);
      expect(result.list).toBeInstanceOf(MessageTemplateResponseDto);
      // expect(result.list[0]).toBeInstanceOf(MessageTemplateResponseDto);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('ID로 메시지 템플릿을 반환해야 한다', async () => {
      const template = { id: '1', name: '테스트' };
      jest.spyOn(service, 'findOne').mockResolvedValue(template as any);

      const result = await controller.findOne('1');
      expect(result).toEqual(template);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('메시지 템플릿을 업데이트해야 한다', async () => {
      const dto = { name: '업데이트됨' };
      jest.spyOn(service, 'update').mockResolvedValue({ affected: 1 } as any);

      const result = await controller.update('1', dto);
      expect(result).toEqual(null);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });
});
