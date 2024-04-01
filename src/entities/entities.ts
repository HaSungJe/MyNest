import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo } from './user_info.entity';
import { OnlineSale } from './online_sale.entity';
import { Main } from './t_main.entity';
import { Sub } from './t_sub.entity';

@Injectable()
export class Entities {
    constructor(
        @InjectRepository(UserInfo)
        public readonly userInfoRepo: Repository<UserInfo>,

        @InjectRepository(OnlineSale)
        public readonly onlineSaleRepo: Repository<OnlineSale>,

        @InjectRepository(Main)
        public readonly mainRepo: Repository<Main>,

        @InjectRepository(Sub)
        public readonly subRepo: Repository<Sub>
    ) {}
}

export {
    UserInfo,
    OnlineSale,
    Main,
    Sub
}