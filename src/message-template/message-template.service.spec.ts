import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplateService } from './message-template.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('MessageTemplateService', () => {
  let service: MessageTemplateService;
  let repository: Repository<MessageTemplate>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageTemplateService,
        {
          provide: getRepositoryToken(MessageTemplate),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MessageTemplateService>(MessageTemplateService);
    repository = module.get<Repository<MessageTemplate>>(
      getRepositoryToken(MessageTemplate),
    );
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('새로운 메시지 템플릿을 저장해야 한다', async () => {
      const dto = { name: '테스트', body: '본문', title: '제목', type: '유형' };
      jest.spyOn(repository, 'save').mockResolvedValue(dto as any);

      const result = await service.create(dto);
      expect(result).toEqual(dto);
      expect(repository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('모든 메시지 템플릿을 반환해야 한다', async () => {
      const templates = [{ id: '1', name: '테스트' }];
      jest.spyOn(repository, 'find').mockResolvedValue(templates as any);

      const result = await service.findAll();
      expect(result).toEqual(templates);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('ID로 메시지 템플릿을 반환해야 한다', async () => {
      const template = { id: '1', name: '테스트' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(template as any);

      const result = await service.findOne('1');
      expect(result).toEqual(template);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('템플릿을 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('메시지 템플릿을 업데이트해야 한다', async () => {
      const dto = { name: '업데이트됨' };
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.update('1', dto);
      expect(result).toEqual({ affected: 1 });
      expect(repository.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('makeTemplateMessage', () => {
    it('템플릿의 플레이스홀더를 대체해야 한다', () => {
      const content = '안녕하세요, {name}님!';
      const params = { name: '세계' };
      const result = service.makeTemplateMessage(content, params);
      expect(result).toBe('안녕하세요, 세계님!');
    });
  });
});
