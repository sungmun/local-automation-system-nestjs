import { validate } from 'class-validator';
import { CreateMessageTemplateDto } from './create-message-template.dto';

describe('CreateMessageTemplateDto', () => {
  it('모든 필드가 유효한 경우 유효성 검사가 통과해야 한다', async () => {
    const dto = new CreateMessageTemplateDto();
    dto.name = 'Test Name';
    dto.body = 'Test Body';
    dto.title = 'Test Title';
    dto.type = 'Test Type';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('name이 없으면 유효성 검사가 실패해야 한다', async () => {
    const dto = new CreateMessageTemplateDto();
    dto.body = 'Test Body';
    dto.title = 'Test Title';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('body가 없으면 유효성 검사가 실패해야 한다', async () => {
    const dto = new CreateMessageTemplateDto();
    dto.name = 'Test Name';
    dto.title = 'Test Title';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('title이 없으면 유효성 검사가 실패해야 한다', async () => {
    const dto = new CreateMessageTemplateDto();
    dto.name = 'Test Name';
    dto.body = 'Test Body';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('type이 없어도 기본값으로 설정되어 유효성 검사가 통과해야 한다', async () => {
    const dto = new CreateMessageTemplateDto();
    dto.name = 'Test Name';
    dto.body = 'Test Body';
    dto.title = 'Test Title';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.type).toBe('changed');
  });
});
