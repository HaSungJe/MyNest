import { Controller, Get, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from '../service/app.service';
import { AWSService } from '../service/aws.service';
import * as util from '../util/util';

@Controller()
export class AppController {
    constructor(
        private readonly service: AppService,
        private readonly AWS_service: AWSService
    ) {}

    @Get()
    getHello(): object {
        return this.service.getJson();
    }

    // DynamoDB 데이터 등록
    @Put("/dynamodb/put")
    async DynamoDBPut(@Req() req: Request, @Res() res: Response) {
        let message = req.body.message;
        if (!util.isNull(message)) {
            return res.status(400).send({
                success: false,
                err: '메세지는 필수 입력값입니다.'
            });
        }

        let result = await this.AWS_service.Dynamo_put(message);
        let status = result.success ? 200 : 400;
        return res.status(status).send(result);
    }

    // DynamoDB 데이터 목록
    @Get("/dynamodb/get")
    async DynamoDBGet(@Req() req: Request, @Res() res: Response) {
        let result = await this.AWS_service.Dynamo_get();
        let status = result.success ? 200 : 400;
        return res.status(status).send(result);
    }
}
