import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityModule } from './entity.module';
import typeOrmConfig from '../../typeorm.config';

import { EntitiyConstructor } from '../entities/entitiyConstructor';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { AWSService } from '../service/aws.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        EntityModule,
    ],
    controllers: [AppController],
    providers: [EntitiyConstructor, AppService, AWSService],
})
export class AppModule {}
