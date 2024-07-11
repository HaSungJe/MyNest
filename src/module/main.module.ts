import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { FileModule } from './file.module';
import { ExcelModule } from './excel.module';

@Module({
    imports: [
        UserModule, FileModule, ExcelModule
    ]
})

export class MainModule {}
