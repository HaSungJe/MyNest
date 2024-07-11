import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { FileModule } from './file.module';

@Module({
    imports: [
        UserModule, FileModule
    ]
})

export class MainModule {}
