import { ApiProperty } from '@nestjs/swagger';

export class RecipeDto {
  @ApiProperty({
    description: '레시피 이름',
    example: '레시피 이름',
  })
  name: string;

  @ApiProperty({
    description: '레시피 설명',
    example: '이 레시피는 특정 조건에서 실행됩니다.',
  })
  description: string;

  @ApiProperty({
    description: '레시피 타입',
    example: 'AUTOMATION',
  })
  type: string;

  @ApiProperty({
    description: '레시피 활성화 여부',
    example: true,
    default: true,
  })
  active: boolean;

  @ApiProperty({
    description: '레시피 타이머 (분 단위, -1은 타이머 없음)',
    example: -1,
    default: -1,
  })
  timer: number;
}
