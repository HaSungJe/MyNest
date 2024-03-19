import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { AWSService } from '../service/aws.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, AWSService],
})
export class AppModule {}
