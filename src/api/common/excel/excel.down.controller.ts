import { Controller, Get, Res, UseInterceptors } from "@nestjs/common";
import { Response } from 'express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginInterceptor } from "@root/interceptor/auth.interceptor";
import * as util from '@root/util/util';
import * as conf from './conf';
import { UserService } from "@root/api/v1/user/user.service";


@ApiTags('엑셀기능')
@Controller('/api/excel/down')
@UseInterceptors(LoginInterceptor)
export class DownloadExcelControllerLogin {
    constructor(
        private readonly userService: UserService
    ) {}

    /**
     * 회원 목록
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Get('/user')
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOperation({
        summary: '회원 목록',
        description: '회원 목록',
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            file: {
                type: 'object', description: '엑셀파일'
            }
        }
    }})
    @ApiResponse({ status: 400, description: '실패', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 400},
            message: {type: 'string', description: '메세지', example: '메세지'}
        }
    }})
    @ApiResponse({ status: 401, description: '로그인 만료', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 401},
            code: {type: 'string', description: '오류 코드', example: ['NOT_AUTH_TOKEN', 'FAIL_AUTH_TOKEN', 'EXPIRE_AUTH_TOKEN']},
            message: {type: 'string', description: '메세지', example: '메세지'}
        }
    }})
    async users(@Res() res: Response) {
        let result = await this.userService.list();

        // Sheet 생성
        let sheet = util.createSheet(conf.excel_down_user_conf, result['users']);

        // Sheet를 파일에 붙이기
        let file = await util.createExcel([{name: '회원 목록', sheet}])
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="user_list.xlsx"`)
        return res.status(200).end(Buffer.from(file, 'base64'));
    }
}
