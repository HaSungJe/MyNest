import { Module } from '@nestjs/common';
import { FileModule } from './file.module';
import { AppModule } from './app.module';
import { SNSModule } from './sns.module';
import { GraphQLModuleFile } from './graphql.module';

@Module({
    imports: [GraphQLModuleFile, FileModule, AppModule, SNSModule],
    controllers: [],
    providers: []
})
export class MainModule {}
