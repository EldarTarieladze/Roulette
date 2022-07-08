import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ValidationPipe,
} from '@nestjs/common';

interface Error {
  error: string;
  message: string;
}
export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Error[]) {
    super();
  }
}

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    return response.status(400).json({
      statusCode: 400,
      validationErrors: exception.validationErrors.map((err) => {
        return { error: err.error, message: err.message.split('-')[0] };
      }),
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Roulette Game')
    .setDescription('The Roulette API description')
    .setVersion('1.0')
    .addBearerAuth(
      { bearerFormat: 'JWT', scheme: 'bearer', type: 'http' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  app.enableCors({ origin: 'localhost:3000' });
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
