import { Controller, Get, Req, Res, UseInterceptors } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Key } from "@root/schemas/key.schema";
import { Request, Response } from "express";
import { Model } from "mongoose";
import * as util from '@util/util';
import * as moment from 'moment';

@Controller('/api/v1/key')
export class KeyController {
    constructor(
        @InjectModel('Key') private keyModel: Model<Key>
    ) {}

    @Get('/get')
    async get(@Req() req: Request, @Res() res: Response) {
        console.log(req.headers.token)

        const key = await this.keyModel.findOne({user_seq: 1}).exec();
        return res.status(200).send({statusCode: 200, message: 'ok', api_key: key.api_key})
    }

    @Get('/put')
    async put(@Res() res: Response) {
        try {
            const now = moment().format('YYYY-MM-DD HH:mm:ss');
            const api_key = util.createJWTToken(JSON.stringify({ user_seq: 1, reg_dt: now}), 100, 'y');
            await this.keyModel.findOneAndUpdate(
                {user_seq: 1},
                {api_key, reg_dt: now},
                {new: true, upsert: true},
            )

            return res.status(200).send({ statusCode: 200, message: 'ok', api_key });
        } catch (error) {
            return res.status(400).send({statusCode: 400, message: error.toString()});
        }
    }

    @Get('/patch')
    async patch(@Res() res: Response) {
        const result = await this.keyModel.updateOne({api_key: 'asdf12345'}, {user_seq: 2});
        return res.status(200).send({statusCode: 200, message: 'ok', result})
    }
}