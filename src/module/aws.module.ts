import { Module } from '@nestjs/common';
import { AWSService } from '../api/aws/aws.service';
import { AWSSql } from '@root/api/aws/aws.sql';
 
@Module({
    exports: [AWSService, AWSSql],
    providers: [AWSService, AWSSql],
})

export class AWSModule {}