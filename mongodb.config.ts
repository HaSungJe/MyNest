import * as path from 'path';
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

export default `mongodb://${process.env.MONGODB_URL}/${process.env.MONGODB_DB}`