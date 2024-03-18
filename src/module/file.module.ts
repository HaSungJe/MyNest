import { Module } from '@nestjs/common';
import { FileController } from '../controller/file.controller';
import { FileService } from '../service/file.service';
import { AWSService } from '../service/aws.service';

@Module({
    imports: [],
    controllers: [FileController],
    providers: [FileService, AWSService],
})
export class FileModule {}
