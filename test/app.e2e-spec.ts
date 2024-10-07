import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('RoomController (e2e)', () => {
    it('PUT /rooms/:roomId/active', async () => {
      const response = await request(app.getHttpServer()).put(
        '/rooms/1/active',
      );
      expect(response.status).toBe(200);
    });
  });
});
