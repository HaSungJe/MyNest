import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeySchema } from '@root/schemas/key.schema';
import { MongoDBModule } from '../common/mongodb.module';
import { KeyController } from '@root/api/v1/key/key.controller';

@Module({
    imports: [MongoDBModule, MongooseModule.forFeature([{name: 'Key', schema: KeySchema}])],
    controllers: [KeyController],
    providers: [],
    exports: []
})

export class KeyModule {}
