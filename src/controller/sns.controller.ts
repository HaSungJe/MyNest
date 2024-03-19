import { Controller, Post, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { SNSService } from '../service/sns.service';
import { AWSService } from '../service/aws.service';
import * as util from '../util/util';

@Controller("/sns")
export class SNSController {
    constructor(
        private readonly service: SNSService,
        private readonly AWS_service: AWSService,
        // private readonly util: Util
    ) {}

    // SMS 보내기
    @Post("/send")
    async send(@Req() req: Request): Promise<object> {
        let mobile = req.body.mobile;
        let message = req.body.message;        

        // 필수 파라미터 체크
        if (!util.isNull(mobile)) {
            return {
                success: false,
                err: '전화번호는 필수 입력값입니다.'
            }
        } else if (!util.isNull(message)) {
            return {
                success: false,
                err: '내용은 필수 입력값입니다.'
            }
        }

        let result = await this.AWS_service.SMS_send(mobile, message);
        if (result.success) {
            return {
                success: true
            }
        } else {
            return {
                success: false,
                err: result.err
            }
        }
    }
}
