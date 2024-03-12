import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { FileModule } from './file.module';

@Module({
    imports: [FileModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
