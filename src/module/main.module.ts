import { Module } from '@nestjs/common';
import { UserModule } from './v1/user.module';
import { FileModule } from './common/file.module';
import { ExcelModule } from './common/excel.module';

@Module({
    imports: [
        UserModule, FileModule, ExcelModule
    ]
})

export class MainModule {}
