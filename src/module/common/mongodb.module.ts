import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoDBConfig from '../../../mongodb.config';
const mongooseModule = MongooseModule.forRoot(mongoDBConfig);

@Module({
    imports: [mongooseModule],
    exports: [mongooseModule]
})

export class MongoDBModule {}
