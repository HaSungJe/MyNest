import { Module } from '@nestjs/common';
import { FileModule } from './file.module';
import { AppModule } from './app.module';
import * as moment from 'moment';

@Module({
    imports: [FileModule, AppModule],
    controllers: [],
    providers: [
        {provide: 'moment', useValue: moment}
    ],
})
export class MainModule {}
