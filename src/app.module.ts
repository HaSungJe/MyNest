import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { AppController } from './controller/app.controller';
import { FileController } from './controller/file.controller';

import { AppService } from './service/app.service';
import { FileService } from './service/file.service';

@Module({
    imports: [],
    controllers: [AppController, FileController],
    providers: [AppService, FileService],
})
export class AppModule {}
