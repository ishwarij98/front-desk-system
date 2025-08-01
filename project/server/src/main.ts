import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Enable CORS so frontend (3001) can talk to backend (3000)
  app.enableCors({
    origin: '*', // Allow all origins for now
  });


  // Parse JSON and validate inputs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const port = 5001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
}
bootstrap();
