import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageTemplate } from './entities/message-template.entity';
import { Repository } from 'typeorm';
import * as stringTemplate from 'string-template';
@Injectable()
export class MessageTemplateService {
  constructor(
    @InjectRepository(MessageTemplate)
    private readonly messageTemplateRepository: Repository<MessageTemplate>,
  ) {}

  async create(createMessageTemplateDto: CreateMessageTemplateDto) {
    return this.messageTemplateRepository.save(createMessageTemplateDto);
  }

  async findAll() {
    return this.messageTemplateRepository.find();
  }

  async findOne(id: string) {
    const template = await this.messageTemplateRepository.findOne({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Message template not found');
    }
    return template;
  }

  async update(id: string, updateMessageTemplateDto: UpdateMessageTemplateDto) {
    return this.messageTemplateRepository.update(id, updateMessageTemplateDto);
  }

  makeTemplateMessage(content: string, params: object): string {
    return stringTemplate(content, params);
  }
}