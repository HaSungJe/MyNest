import { NestFactory } from '@nestjs/core';
import { MainModule } from './module/main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DashboardModule } from './module/v1/dashboard.module';
import * as bodyParser from 'body-parser';
import { PayloadTooLargeExceptionFilter } from './exception/exception';
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(MainModule);
    
    // JSON Parser의 크기 제한 설정
    const limit = process.env.PAYLOAD_LIMIT_SIZE;
    app.use(bodyParser.urlencoded({ limit, extended: true }));
    app.useGlobalFilters(new PayloadTooLargeExceptionFilter());

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
        "allowedHeaders": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    });

    await app.listen(process.env.SERVER_PORT || 3000);
}

bootstrap();