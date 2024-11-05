import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../../../typeorm.config';

// const typeormModule = TypeOrmModule.forRoot(typeOrmConfig);

@Module({
    imports: [],
    exports: []
})

export class TypeORMModule {}
