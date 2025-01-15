import { plainToInstance } from 'class-transformer';
import { HejHomeRecipeCommandDto } from './hej-home-recipe-command.dto';
import { RecipeCommandPlatform } from '../entities/recipe-command.entity';

describe('HejHomeRecipeCommandDto', () => {
  describe('생성자 테스트', () => {
    it('모든 필수 속성이 정상적으로 설정되어야 합니다', () => {
      const plain = {
        command: { power: 'on', temperature: 25 },
        deviceId: 'device123',
        name: '에어컨 켜기',
        platform: RecipeCommandPlatform.HEJ_HOME,
      };

      const dto = plainToInstance(HejHomeRecipeCommandDto, plain);

      expect(dto.command).toEqual({ power: 'on', temperature: 25 });
      expect(dto.deviceId).toBe('device123');
      expect(dto.name).toBe('에어컨 켜기');
      expect(dto.platform).toBe(RecipeCommandPlatform.HEJ_HOME);
    });

    it('RecipeCommandDto를 상속받아야 합니다', () => {
      const plain = {
        command: { power: 'on' },
        deviceId: 'device123',
        name: '에어컨 켜기',
        platform: RecipeCommandPlatform.HEJ_HOME,
      };

      const dto = plainToInstance(HejHomeRecipeCommandDto, plain);

      expect(dto).toHaveProperty('command');
      expect(dto).toHaveProperty('deviceId');
      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('platform');
    });

    it('command가 객체 타입이어야 합니다', () => {
      const plain = {
        command: { power: 'on' },
        deviceId: 'device123',
        name: '에어컨 켜기',
        platform: RecipeCommandPlatform.HEJ_HOME,
      };

      const dto = plainToInstance(HejHomeRecipeCommandDto, plain);

      expect(typeof dto.command).toBe('object');
      expect(dto.command).not.toBeNull();
    });
  });
});
