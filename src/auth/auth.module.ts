import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HejhomeApiModule } from '../hejhome-api/hejhome-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HejhomeApiModule, ConfigModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
