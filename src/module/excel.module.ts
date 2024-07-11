import { Module } from '@nestjs/common';
import { TypeORMModule } from './typeorm.module';
import { UploadExcelControllerLogin } from '@root/api/excel/excel.up.controller';
import { DownloadExcelControllerLogin } from '@root/api/excel/excel.down.controller';
import { UserModule } from './user.module';

@Module({
    imports: [TypeORMModule, UserModule],
    exports: [],
    controllers: [UploadExcelControllerLogin, DownloadExcelControllerLogin],
    providers: [],
})

export class ExcelModule {}
