import { Module } from '@nestjs/common';
import { TypeORMModule } from './typeorm.module';
import { UserModule } from '../v1/user.module';
import { UploadExcelControllerLogin } from '@root/api/common/excel/excel.up.controller';
import { DownloadExcelControllerLogin } from '@root/api/common/excel/excel.down.controller';

@Module({
    imports: [TypeORMModule, UserModule],
    exports: [],
    controllers: [UploadExcelControllerLogin, DownloadExcelControllerLogin],
    providers: [],
})

export class ExcelModule {}
