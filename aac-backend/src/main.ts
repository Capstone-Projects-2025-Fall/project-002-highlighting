import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable CORS so frontend can call this API. Set FRONTEND_ORIGIN in env for production.
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN || true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
