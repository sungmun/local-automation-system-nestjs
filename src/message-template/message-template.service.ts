import { Injectable } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageTemplateService {
  constructor(
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
  ) {}

  create(createMessageTemplateDto: CreateMessageTemplateDto) {
    return this.messageTemplateRepository.save(createMessageTemplateDto);
  }

  findAll() {
    return this.messageTemplateRepository.find();
  }

  findOne(id: string) {
    return this.messageTemplateRepository.findOne({ where: { id } });
  }

  update(id: string, updateMessageTemplateDto: UpdateMessageTemplateDto) {
    return this.messageTemplateRepository.update(id, updateMessageTemplateDto);
  }
}
