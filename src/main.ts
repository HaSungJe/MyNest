import { NestFactory } from '@nestjs/core';
import { MainModule } from './module/main.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(MainModule);
    await app.listen(3000);
}
bootstrap();
