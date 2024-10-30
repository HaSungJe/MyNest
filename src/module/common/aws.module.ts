import { Module } from '@nestjs/common';
import { AWSService } from '@root/api/common/aws/aws.service';
import { AWSSql } from '@root/api/common/aws/aws.sql';
 
@Module({
    exports: [AWSService, AWSSql],
    providers: [AWSService, AWSSql],
})

export class AWSModule {}