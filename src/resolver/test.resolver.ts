import { Resolver, Query, ObjectType } from '@nestjs/graphql';
import { DataSource } from 'typeorm';
import { InterFace1 } from '../../graphql.interface';

@Resolver()
export class TestResolver {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    @Query(returns => String)
    hello(): string {
        return "Hello"
    }


    @Query(returns => String)
    bye(): string {
        return "Bye"
    }

    @Query(returns => [InterFace1])
    async query1(): Promise<InterFace1[]> { // 수정된 부분
        let builder = this.dataSource.createQueryBuilder();
        builder.select([
            'DATE_FORMAT(s.sales_date, "%Y") AS year',
            'DATE_FORMAT(s.sales_date, "%m") AS month',
            'u.gender AS gender',
            's.user_id AS user_id'
        ]);
        builder.from('online_sale', 's');
        builder.innerJoin('user_info', 'u', 's.user_id = u.user_id');
        builder.where('u.gender in (0, 1)');

        let from = builder.getQuery();
        builder = this.dataSource.createQueryBuilder();
        builder.select([
            'a.year',
            'a.month',
            'a.gender',
            'count(distinct(a.user_id)) as users'
        ]);
        builder.from(`(${from})`, 'a');
        builder.groupBy('a.year, a.month, a.gender');
        builder.orderBy('a.year, a.month, a.gender');
        return await builder.getRawMany()
    }
}