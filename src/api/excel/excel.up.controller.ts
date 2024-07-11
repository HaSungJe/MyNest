import { Controller, Put, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LoginInterceptor } from "@root/interceptor/auth.interceptor";
import { UserService } from "../user/user.service";
import { ExcelUserPutDTO } from "../user/user.dto";
import * as util from '@root/util/util';
import * as conf from './conf';

@ApiTags('엑셀기능')
@Controller('/api/up/excel')
@UseInterceptors(LoginInterceptor)
export class UploadExcelControllerLogin {
    constructor(
        private readonly userService: UserService
    ) {}

    /**
     * 회원 엑셀등록
     * 
     * @param files 
     * @param res 
     * @returns 
     */
    @Put('/user')
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiOperation({
        summary: '회원 엑셀등록',
        description: '회원 엑셀등록',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {type: 'object', description: '엑셀파일', example: '파일.xlsx'}
            },
            required: ['file']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            results: {type: 'Array', description: '결과. 각각의 성공/실패 여부와 기본 정보를 반환', example: [
                {
                    "line": 1,
                    "user_email": "이메일",
                    "user_name": "이름",
                    "user_nickname": "별명",
                    "success": true
                },
                {
                    "line": 2,
                    "user_email": "이메일",
                    "user_name": "이름",
                    "user_nickname": "별명",
                    "message": "비밀번호를 입력해주세요."
                }
            ]}
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
    @UseInterceptors(FilesInterceptor('files', 10, {storage: memoryStorage(), limits: { fileSize: 10 * (1024 * 1024) }})) // 10MB
    async user(@UploadedFiles() files: Express.Multer.File[], @Res() res: Response) {
        if (files && files.length > 0) {
            let read = util.readExcel(conf.excel_up_user_conf, files[0]);
            if (read['statusCode'] === 200) {
                let results = [];
                for (let i=0; i<read['result'].length; i++) {
                    let result = await this.userService.excelPut(new ExcelUserPutDTO(read['result'][i]));
                    if (result['statusCode'] === 200) {
                        results.push({
                            line: i+1,
                            id: read['result'][i]['user_id'],
                            name: read['result'][i]['user_name'],
                            success: true
                        });
                    } else {
                        results.push({
                            line: i+1,
                            id: read['result'][i]['user_id'],
                            name: read['result'][i]['user_name'],
                            success: false,
                            message: result['message']
                        })
                    }
                }
    
                return res.status(200).send({statusCode: 200, results: results});
            } else {
                return res.status(read['statusCode']).send(read);
            }
        } else {
            return res.status(400).send({statusCode: 400, message: '파일을 등록해주세요.'})
        }
    }
}