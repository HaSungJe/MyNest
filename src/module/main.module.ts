import { Module } from '@nestjs/common';

// Librarys
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';

// Modules
import { FileModule } from './file.module';
import { AppModule } from './app.module';
import { SNSModule } from './sns.module';

@Module({
    imports: [FileModule, AppModule, SNSModule],
    controllers: [],
    providers: [
        {provide: 'moment', useValue: moment},
        {provide: 'bcrypt', useValue: bcrypt}
    ],
})
export class MainModule {}
