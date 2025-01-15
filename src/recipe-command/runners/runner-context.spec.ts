import { RunnerContext } from './runner-context';
import { RecipeCommand } from '../entities/recipe-command.entity';

describe('RunnerContext', () => {
  let command: RecipeCommand;
  let context: RunnerContext;

  beforeEach(() => {
    command = {
      id: 1,
      platform: 'test-platform',
    } as unknown as RecipeCommand;
  });

  describe('생성자', () => {
    it('추가 데이터 없이 생성할 수 있어야 합니다', () => {
      context = new RunnerContext(command);
      expect(context.recipeCommand).toBe(command);
    });

    it('추가 데이터와 함께 생성할 수 있어야 합니다', () => {
      const additionalData = { key: 'value' };
      context = new RunnerContext(command, additionalData);
      expect(context.recipeCommand).toBe(command);
    });
  });

  describe('getValue', () => {
    it('존재하는 키의 값을 반환해야 합니다', () => {
      const additionalData = { key: 'value' };
      context = new RunnerContext(command, additionalData);
      expect(context.getValue('key')).toBe('value');
    });

    it('존재하지 않는 키에 대해 undefined를 반환해야 합니다', () => {
      context = new RunnerContext(command);
      expect(context.getValue('nonexistent')).toBeUndefined();
    });
  });

  describe('hasValue', () => {
    it('존재하는 키에 대해 true를 반환해야 합니다', () => {
      const additionalData = { key: 'value' };
      context = new RunnerContext(command, additionalData);
      expect(context.hasValue('key')).toBe(true);
    });

    it('존재하지 않는 키에 대해 false를 반환해야 합니다', () => {
      context = new RunnerContext(command);
      expect(context.hasValue('nonexistent')).toBe(false);
    });

    it('값이 null이나 undefined인 경우에도 true를 반환해야 합니다', () => {
      const additionalData = { nullKey: null, undefinedKey: undefined };
      context = new RunnerContext(command, additionalData);
      expect(context.hasValue('nullKey')).toBe(true);
      expect(context.hasValue('undefinedKey')).toBe(true);
    });
  });
});
