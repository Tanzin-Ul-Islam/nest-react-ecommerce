import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common'
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    const configService = app.get(ConfigService);
    const PORT = parseInt(configService.get('PORT'), 10) || 3000;

    await app.listen(PORT);
    console.log(`Application is listening on port ${PORT}`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();