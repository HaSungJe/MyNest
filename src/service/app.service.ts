import { Injectable } from '@nestjs/common';
import { Entities, UserInfo, Main, Sub } from '../entities/entities';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
    constructor(
        private readonly eitnties: Entities,
        private readonly dataSource: DataSource
    ) {}

    getJson(): object {
        return {
            success: true,
            message: 'Hellow World !'
        }
    }

    // typeorm query builder
    async typeorm() {
        let builder = this.eitnties.onlineSaleRepo.createQueryBuilder('s');
        builder.select([
            'DATE_FORMAT(s.sales_date, "%Y") AS year',
            'DATE_FORMAT(s.sales_date, "%m") AS month',
            'u.gender AS gender',
            's.user_id AS user_id'
        ]);
        builder.innerJoin(UserInfo, 'u', 's.user_id = u.user_id');
        builder.where('u.gender in (0, 1)');

        let from = builder.getQuery();
        builder = this.eitnties.onlineSaleRepo.createQueryBuilder();
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
            find: await this.eitnties.userInfoRepo.find(),
            builder: result
        }
    }

    // typeorm put
    async typeormPut(data: object, ip: string) {
        let conn = this.dataSource.createQueryRunner();
        await conn.connect();
        await conn.startTransaction();

        console.log("TEST")

        try {
            // 1. 메인 등록
            let main = new Main();
            main.ip = ip;

            let result = await conn.manager.save(main);
            console.log(result)

            // 2. 서브 등록
            let sub = new Sub();
            sub.seq = result.seq;
            sub.data_1 = data['data_1'];
            sub.data_2 = data['data_2'];
            sub.data_3 = data['data_3'];
            let result2 = await conn.manager.save(sub);
            console.log(result2)

            await conn.commitTransaction();
            return {
                success: true,
                main: result,
                sub: sub
            }
        } catch (err) {
            console.log(err)
            await conn.rollbackTransaction();
            return {
                success: false,
                err: err.toString()
            }
        } finally {
            await conn.release();
        }
    }
}
