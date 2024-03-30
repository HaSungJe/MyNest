import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityModule } from './entity.module';
import typeOrmConfig from '../../typeorm.config';

import { Entities } from '../entities/entities';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { AWSService } from '../service/aws.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        EntityModule,
    ],
    controllers: [AppController],
    providers: [Entities, AppService, AWSService],
})
export class AppModule {}
