import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    await this.authService.refreshToken();
  }
}
