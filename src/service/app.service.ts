import { Injectable } from '@nestjs/common';
import { Entities, UserInfo } from '../entities/entities';

@Injectable()
export class AppService {
    constructor(
        private readonly entityCon: Entities,
    ) {}

    getJson(): object {
        return {
            success: true,
            message: 'Hellow World !'
        }
    }

    async typeorm() {
        let builder = this.entityCon.onlineSaleRepo.createQueryBuilder('s');
        builder.select([
            'DATE_FORMAT(s.sales_date, "%Y") AS year',
            'DATE_FORMAT(s.sales_date, "%m") AS month',
            'u.gender AS gender',
            's.user_id AS user_id'
        ]);
        builder.innerJoin(UserInfo, 'u', 's.user_id = u.user_id');
        builder.where('u.gender in (0, 1)');

        let from = builder.getQuery();
        builder = this.entityCon.onlineSaleRepo.createQueryBuilder();
        builder.select([
            'a.year',
            'a.month',
            'a.gender',
            'count(distinct(a.user_id)) as users'
        ]);
        builder.from(`(${from})`, 'a');
        builder.groupBy('a.year, a.month, a.gender');
        builder.orderBy('a.year, a.month, a.gender');

        let result = await builder.getRawMany()
        // console.log(result)

        return {
            find: await this.entityCon.userInfoRepo.find(),
            builder: result
        }
    }
}
