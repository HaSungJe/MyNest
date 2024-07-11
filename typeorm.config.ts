import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DB,
    username: process.env.MYSQL_ID,
    password: process.env.MYSQL_PW,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: process.env.TYPEORM_SYNC === 'T' ? true : false
};

export default typeOrmConfig;