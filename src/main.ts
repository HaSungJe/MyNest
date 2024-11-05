import { NestFactory } from '@nestjs/core';
import { MainModule } from './module/main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DashboardModule } from './module/v1/dashboard.module';
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(MainModule);
    
    // 기본 템플릿 ejs 설정
    app.useStaticAssets(path.resolve(__dirname, '../../public'));
    app.setBaseViewsDir(path.resolve(__dirname, '../../views'));
    app.setViewEngine('ejs');

    // API Swagger
    const swagger_api_config = new DocumentBuilder()
    .setTitle('API Document')
    .setVersion('1.0')
    .addServer(process.env.SERVER_URL)
    .build();
    const swagger_api_document = SwaggerModule.createDocument(app, swagger_api_config, {
        include: [
            DashboardModule
        ]
    });
    SwaggerModule.setup('swagger', app, swagger_api_document);

    // CORS
    app.enableCors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    });

    await app.listen(process.env.PORT || 3000);
}

bootstrap();