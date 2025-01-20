import { NotFoundException } from '@nestjs/common';

export class RecipeNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`레시피 ID ${id}를 찾을 수 없습니다`);
  }
}
