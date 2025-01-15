import { NotFoundException, BadRequestException } from '@nestjs/common';

export class RecipeNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`레시피 ID ${id}를 찾을 수 없습니다`);
  }
}

export class RecipeInactiveException extends BadRequestException {
  constructor(id: number) {
    super(`레시피 ID ${id}가 비활성화 상태입니다`);
  }
}
