import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserInfo } from './user_info.entity';
import { OnlineSale } from './online_sale.entity';

@Injectable()
export class Entities {
    constructor(
        @InjectRepository(UserInfo)
        public readonly userInfoRepo: Repository<UserInfo>,

        @InjectRepository(OnlineSale)
        public readonly onlineSaleRepo: Repository<OnlineSale>
    ) {}
}
