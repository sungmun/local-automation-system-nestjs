import { HejhomeApiService } from './hejhome-api.service';
import { ConfigService } from '@nestjs/config';

describe('HejhomeApiService', () => {
  let service: HejhomeApiService;

  beforeEach(() => {
    service = new HejhomeApiService(new ConfigService());
  });

  it('서비스가 정의되어야 한다', () => {
    expect(service).toBeDefined();
  });
});
