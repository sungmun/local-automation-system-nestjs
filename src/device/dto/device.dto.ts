import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeviceDto {
  @ApiProperty({
    description: '장치 ID',
    example: 'device123',
  })
  id: string;

  @ApiProperty({
    description: '장치 이름',
    example: '거실 에어컨',
  })
  name: string;

  @ApiProperty({
    description: '장치 타입',
    example: 'AIR_CONDITIONER',
  })
  deviceType: string;

  @ApiProperty({
    description: '장치 모델명',
    example: 'Samsung AC-100',
  })
  modelName: string;

  @ApiProperty({
    description: '가족 ID',
    example: 'family123',
  })
  familyId: string;

  @ApiProperty({
    description: '방 ID',
    example: 1,
    required: false,
  })
  roomId?: number;

  @ApiProperty({
    description: '장치 카테고리',
    example: 'CLIMATE',
  })
  category: string;

  @ApiProperty({
    description: '온라인 상태',
    example: true,
  })
  online: boolean;

  @ApiProperty({
    description: '하위 장치 보유 여부',
    example: false,
  })
  hasSubDevices: boolean;

  @ApiProperty({
    description: '활성화 여부',
    example: true,
    default: true,
  })
  active?: boolean = true;

  @ApiProperty({
    description: '플랫폼',
    example: 'hejhome',
    default: 'hejhome',
  })
  platform?: string = 'hejhome';

  @ApiProperty({
    description: '상태 업데이트 시간',
    example: '2024-01-01T09:00:00Z',
    required: false,
  })
  updateStateAt?: string;

  @ApiProperty({
    description: '메시지 템플릿 활성화 여부',
    example: false,
    default: false,
  })
  activeMessageTemplate?: boolean = false;

  @Expose({ name: 'state' })
  @Exclude()
  @ApiProperty({
    description: '장치 상태',
    example: {
      power: 'on',
      temperature: 25,
    },
    required: false,
    name: 'state',
  })
  _state?: string;

  get state() {
    return this._state || '';
  }

  set state(state: string) {
    this._state = state;
  }
}
