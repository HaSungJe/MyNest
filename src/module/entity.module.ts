import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from '../entities/user_info.entity';
import { OnlineSale } from '../entities/online_sale.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserInfo, OnlineSale])],
    exports: [TypeOrmModule]
})
export class EntityModule {}
