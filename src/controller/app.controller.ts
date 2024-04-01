import { Controller, Delete, Get, Put, Req, Res } from '@nestjs/common';
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

    
    // 테스트
    @Get("/test")
    async typeorm(): Promise<object> {
        let result = await this.service.typeorm();
        return {
            success: true,
            result: result
        }
    }

    // 등록
    @Put("/put")
    async typeormPut(@Req() req: Request, @Res() res: Response): Promise<object> {
        let result = await this.service.typeormPut(req.body, req.ip);
        let status = result.success ? 200 : 400;
        return res.status(status).send(result);
    }

    // 삭제
    @Delete('/del')
    async typeormDel(@Req() req: Request, @Res() res: Response): Promise<object> {
        let result = await this.service.typeormDel(req.body.seq);
        let status = result.success ? 200 : 400;
        return res.status(status).send(result);
    }

    // 정보
    @Get('/info')
    async typeormGet(@Req() req: Request, @Res() res: Response): Promise<object> {
        let result = await this.service.typeormGet(req.query.seq);
        let status = result.success ? 200 : 400;
        return res.status(status).send(result);
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
