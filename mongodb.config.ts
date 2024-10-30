import * as path from 'path';
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const path_items = ["mongodb://"];
const ports = process.env.MONGODB_PORTS.split(",");
if (ports.length > 1) {
    for (let i=0; i<ports.length; i++) {
        path_items.push(`${process.env.MONGODB_IP}:${ports[i]}${i+1 < ports.length ? "," : ""}`);
    }
    path_items.push(`/${process.env.MONGODB_DB}?replicaSet=${process.env.MONGODB_REPLICA_NAME}`);
} else {
    path_items.push(`${process.env.MONGODB_IP}:${ports[0]}/${process.env.MONGODB_DB}`)
}

export default path_items.join("");