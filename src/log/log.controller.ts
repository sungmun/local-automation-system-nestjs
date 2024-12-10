import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ListLogResponseDto } from './dto/response/list-log-response.dto';

@ApiTags('로그')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiOperation({ summary: '로그 목록 조회' })
  @ApiOkResponse({
    description: '모든 로그 목록을 반환합니다.',
    type: [ListLogResponseDto],
  })
  @Get()
  async findLogs() {
    return this.logService.findLogs();
  }
}
