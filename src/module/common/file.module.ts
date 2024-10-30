import { Module } from '@nestjs/common';
import { TypeORMModule } from './typeorm.module';
import { AWSModule } from './aws.module';
import { FileService } from '@root/api/common/file/file.service';
import { FileSQL } from '@root/api/common/file/file.sql';
import { FileControllerLogin } from '@root/api/common/file/file.controller';

@Module({
    imports: [TypeORMModule, AWSModule],
    exports: [FileService, FileSQL],
    controllers: [FileControllerLogin],
    providers: [FileService, FileSQL],
})

export class FileModule {}
