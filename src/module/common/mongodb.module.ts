import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot(
            'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/mydb?replicaSet=rs0'
        ),
    ]
})

export class MongoDBModule {}
