import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: '*',
  });
  const packageJson = await import(`${process.cwd()}/package.json`);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('홈 자동화 시스템 API')
    .setDescription('홈 자동화 시스템의 API 문서입니다')
    .setVersion(packageJson.version)
    .build();

  SwaggerModule.setup(
    'swagger',
    app,
    () => SwaggerModule.createDocument(app, config),
    { jsonDocumentUrl: 'swagger/json' },
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
