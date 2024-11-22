import { Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { LoginInterceptor } from "@root/interceptor/auth.interceptor";
import { Response } from "express";
import { ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
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
    @ApiQuery({name: 'page', description: '페이지. 기본값 1',  example: 1, required: false})
    @ApiQuery({name: 'size', description: '페이지당 출력될 게시물 수. 기본값 20', example: 20, required: false})
    @ApiQuery({name: 'pageSize', description: '페이지탭에 출력될 페이지의 수. 기본값 10', example: 10, required: false})
    @ApiQuery({name: 'search_type', description: '검색종류. [ALL: 전체, TITLE: 제목, CONTENT: 내용]', example: 'ALL', required: false})
    @ApiQuery({name: 'search_val', description: '검색어', example: '공지', required: false})
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
    @ApiResponse({ status: 405, description: '올바르지 않은 로그인정보. 로그인정보 삭제필요', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 405},
            message: {type: 'string', description: '메세지', example: '메세지'}
        }
    }})
    async hello(@Res() res: Response, @Query() data: GetDataDTO): Promise<object> {
        const dto = new GetDataDTO(data);
        const result = await this.service.hello(dto);
        return res.status(result['statusCode']).send(result);
    }
}