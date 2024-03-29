import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.AWS_RDB_MYSQL_HOST,
    port: parseInt(process.env.AWS_RDB_MYSQL_PORT),
    database: process.env.AWS_RDB_MYSQL_DB,
    username: process.env.AWS_RDB_MYSQL_ID,
    password: process.env.AWS_RDB_MYSQL_PW,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: process.env.DEV_MODE === 'T' ? true : false,
};

export default typeOrmConfig;