import { Injectable } from '@nestjs/common';
import { Entities, Main, Sub } from '../entities/entities';
import { DataSource } from 'typeorm';
import * as moment from 'moment'

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

        let result = await builder.getRawMany()

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
            let main = new Main({ip: ip});
            let result = await conn.manager.save(main);
            console.log(`----1---`)
            console.log(result)

            // 2. 메인 업데이트
            main.ip = main.ip + ' 수정';
            let result2 = await conn.manager.save(main);
            console.log(`----2---`)
            console.log(result2)

            // 3. 서브 등록
            let sub = new Sub({...data, seq: result.seq});
            let result3 = await conn.manager.save(sub);
            console.log(`----3---`)
            console.log(result3)
            
            // 4. 서브 업데이트
            sub.data_1 = sub.data_1 + ' ' + moment().format('YYYY-MM-DD HH:mm:ss');
            sub.data_2 = sub.data_2 + ' ' + moment().format('YYYY-MM-DD HH:mm:ss');
            let result4 = await conn.manager.save(sub);
            console.log(`----4---`)
            console.log(result4)

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

    // typeorm delete
    async typeormDel(seq: number) {
        let conn = this.dataSource.createQueryRunner();
        await conn.connect();
        await conn.startTransaction();

        console.log("TEST")

        try {
            let result = await conn.manager.delete(Sub, {seq: seq});
            console.log(result)

            let result2 = await conn.manager.delete(Main, {seq: seq});
            console.log(result2)

            await conn.commitTransaction();
            return {
                success: true
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

    // typeorm get
    async typeormGet(seq) {
        // let builder = await this.eitnties.mainRepo.createQueryBuilder('m');
        let builder = this.dataSource.createQueryBuilder();
        builder.select([
            `m.seq`,
            `m.ip`,
            `DATE_FORMAT(m.reg_dt, "%Y-%m-%d %H:%i:%s.%S") as reg_dt`,
            `DATE_FORMAT(m.mod_dt, "%Y-%m-%d %H:%i:%s.%S") as mod_dt`,
            `s.data_1`,
            `s.data_2`,
            `s.data_3`
        ]);
        builder.from('t_main', 'm');
        builder.leftJoin('t_sub', 's', 'm.seq = s.seq');
        builder.where('m.seq = :seq', {seq: seq});

        let result = await builder.getRawOne();
        console.log(result)

        return {
            success: true,
            result: result
        }
    }
}
