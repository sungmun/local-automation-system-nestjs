import { Type } from 'class-transformer';
import { DeviceDto } from '../device.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ListDeviceResponseDto {
  @ApiProperty({
    description: '장치 목록',
    type: [DeviceDto],
  })
  @Type(() => DeviceDto)
  list: DeviceDto[];
}
