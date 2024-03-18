import { Module } from '@nestjs/common';
import { SNSController } from '../controller/sns.controller';
import { SNSService } from '../service/sns.service';
import { AWSService } from '../service/aws.service';

@Module({
    imports: [],
    controllers: [SNSController],
    providers: [SNSService, AWSService],
})
export class SNSModule {}
