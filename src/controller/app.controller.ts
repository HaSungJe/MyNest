import { ApiTags, ApiConsumes, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Delete, Get, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from '../service/app.service';
import { AWSService } from '../service/aws.service';
import * as util from '../util/util';

@ApiTags('API List')
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
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOperation({
        summary: 'test API summary',
        description: 'test API description',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data1: {type: 'string', description: '데이터 1', example: 'aaaa'},
                data2: {type: 'string', description: '데이터 2', example: 'bbbb'},
                data3: {type: 'string', description: '데이터 3', example: 'cccc'},
                data4: {type: 'string', description: '데이터 4', example: 'dddd'},
            },
            required: ['data1', 'data2']
        }
    })
    @ApiResponse({ status: 200, description: 'Success', schema: {
        type: 'array',
        properties: {
            user_id: {type: 'number', description: '회원 아이디', example: 1},
            gender: {type: 'number', description: '성별 코드', example: 0},
            age: {type: 'number', description: '나이', example: 26},
            joined: {type: 'string', description: '생성일', example: '2021-06-06'}
        }
    }})
    @ApiResponse({ status: 400, description: 'Fail', schema: {
        type: 'object',
        properties: {
            success: {type: 'number', description: '상태코드', example: 400},
            message: {type: 'string', description: '메시지', example: ['실패메시지1', '실패메시지2']}
        }
    }})
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
