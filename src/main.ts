import { NestFactory, Reflector } from '@nestjs/core';
import { MainModule } from './module/main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { CustomErrorFilter } from './exception/exception';
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(MainModule);
    
    // JSON Parser의 크기 제한 설정
    const limit = '15Mb';
    app.use(bodyParser.json({ limit }));
    app.use(bodyParser.urlencoded({ limit, extended: true }));
    app.useGlobalFilters(new CustomErrorFilter());

    // 기본 템플릿 ejs 설정
    app.useStaticAssets(path.resolve(__dirname, '../../public'));
    app.setBaseViewsDir(path.resolve(__dirname, '../../views'));
    app.setViewEngine('ejs');

    // API Swagger
    const reflector = app.get(Reflector);
    const modules = Reflect.getMetadata('imports', MainModule) || [];
    const swaggerApiConfigData = new DocumentBuilder();
    swaggerApiConfigData.setTitle('API Document');
    swaggerApiConfigData.setVersion('1.0');
    swaggerApiConfigData.addServer(process.env.SERVER_URL);
    const swaggerApiConfig = swaggerApiConfigData.build();

    // API Swagger 링크생성
    const jqueryCDN = `https://code.jquery.com/jquery-3.7.1.slim.js`;
    let html = `<option value="${process.env.SERVER_URL}/swagger">전체</option>`;
    for (let i=0; i<modules.length; i++) {
        const path = reflector.get<string>('path', modules[i]);
        const description = reflector.get<string>('description', modules[i]);
        html += `<option value="${process.env.SERVER_URL}/swagger/${path}">${description}</option>`;
    }
    const js = `
        $(document).ready(function() {
            // 현재 페이지 정보
            const page = window.location.origin + window.location.pathname;

            // 서버 변경시, 주소 이동
            $(document).on('change', '#swaggerList', function() {
                location.href = $(this).val();
            });

            // 서버목록 해당 페이지 맞는 것으로 선택하기
            const selectPage = setInterval(() => {
                const target = $(".schemes-server-container");
                if (target) {
                    const html = \`
                        <div>
                            <span class="servers-title">Tap</span>
                            <div class="servers">
                                <label for="swaggerList">
                                    <select id="swaggerList">
                                        ${html}
                                    </select>  
                                </label>
                            </div>
                        </div>
                    \`;
                    target.append(html);
                    $("#swaggerList").val(page);
                    clearInterval(selectPage);
                }
            }, 100);
        });
    `;

    // Swagger - 전체
    SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, swaggerApiConfig, {
        include: [],
    }), {
        customJs: jqueryCDN,
        customJsStr: js
    });

    // Swagger - 개별
    for (let i=0; i<modules.length; i++) {
        const path = reflector.get<string>('path', modules[i]);
        SwaggerModule.setup(`swagger/${path}`, app, SwaggerModule.createDocument(app, swaggerApiConfig, {
            include: [modules[i]]
        }), {
            customJs: jqueryCDN,
            customJsStr: js
        });
    }

    // CORS
    app.enableCors({
        "origin": "*",
        "allowedHeaders": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    });

    await app.listen(process.env.SERVER_PORT || 7000);
}

bootstrap();