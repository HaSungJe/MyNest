import { Module } from '@nestjs/common';
import { FileModule } from './file.module';
import { AppModule } from './app.module';
import { SNSModule } from './sns.module';

@Module({
    imports: [FileModule, AppModule, SNSModule],
    controllers: [],
    providers: []
})
export class MainModule {}
