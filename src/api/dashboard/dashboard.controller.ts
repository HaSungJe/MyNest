import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { LoginInterceptor } from "@root/interceptor/auth.interceptor";
import { Response } from "express";
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetDataDTO } from "./dashboard.dto";

@Controller('/dashboard')
@ApiTags('대시보드')
@UseInterceptors(LoginInterceptor)
export class DashboardController {
    constructor(
        private readonly service: DashboardService
    ) {}

    /**
     * 인사
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Get('/hello')
    @ApiOperation({
        summary: '인사',
        description: '인사',
    })
    @ApiHeader({name: 'accessToken', description: '로그인 Access Token',  example: 'fca9817c-e296-49ad-aa68-91d095cdee38', required: false})
    @ApiParam({name: 'add_text', description: '추가로 출력될 텍스트', example: '안녕!!', required: false})
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            message: {type: 'string', description: '메세지', example: 'string'}
        }
    }})
    @ApiResponse({ status: 400, description: '실패', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 400},
            message: {type: 'string', description: '메세지', example: '메세지'},
            validationError: {type: 'object', description: '유효성검사 반려정보', example: [
                {
                    "type": "유효성검사 반려 종류",
                    "property": "유효성검사 반려 대상",
                    "message": "유효성검사 반려 메시지"
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
    @ApiResponse({ status: 403, description: '권한 거절', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 403},
            message: {type: 'string', description: '메세지', example: '메세지'}
        }
    }})
    async hello(@Res() res: Response, @Query() data: GetDataDTO): Promise<object> {
        const dto = new GetDataDTO(data);
        const result = await this.service.hello(dto);
        return res.status(result['statusCode']).send(result);
    }
}