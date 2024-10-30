import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../../../typeorm.config';

const typeormModule = TypeOrmModule.forRoot(typeOrmConfig);

@Module({
    imports: [typeormModule],
    exports: [typeormModule]
})

export class TypeORMModule {}
