import { Body, Controller, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileService } from "./file.service";
import { LoginInterceptor } from "@root/interceptor/auth.interceptor";
import { FileGetPresignedUrlDTO, FilesSuccessUploadPresignedUrlDTO } from "./file.dto";

@ApiTags('파일')
@Controller('/api/file')
@UseInterceptors(LoginInterceptor)
export class FileControllerLogin {
    constructor(
        private readonly service: FileService
    ) {}
    
    /**
     * 파일 업로드 URL 얻기
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Post('/presigned')
    @ApiOperation({
        summary: '파일 업로드 URL 얻기',
        description: '파일 업로드 URL 얻기',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                path_head: {type: 'string', description: '대표경로 [Post: 포스트, Profile: 프로필]. 기본값: Post', example: 'Post'},
                files: {type: 'Array', description: '파일정보', example: [
                    {
                        "file_name": "image1.jpg",
                        "file_ext": "jpg",
                        "mime_type": "image/jpeg",
                        "file_size": 12345,
                        "thumb": "N"
                    }
                ]}
            },
            required: ['files']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            list: {type: 'Array', description: '파일 URL 생성정보', example: [
                {
                    "file_name": "파일명",
                    "url": {
                        "success": true,
                        "url": "파일 업로드경로",
                        "file_seq": "파일번호"
                    }
                }
            ]}
        }
    }})
    @ApiResponse({ status: 400, description: '실패', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 400},
            message: {type: 'string', description: '메세지', example: '메세지'},
            errors: {type: 'object', description: '유효성검사 반려정보', example: [
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
    async getPresignedUrl(@Req() req: Request, @Res() res: Response, @Body() data: FileGetPresignedUrlDTO): Promise<object> {
        const dto = new FileGetPresignedUrlDTO(data);
        const result = await this.service.getPresignedUrl(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 파일 업로드 성공정보 수신
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Post('/presigned/success')
    @ApiOperation({
        summary: '파일 업로드 성공정보 수신',
        description: '파일 업로드 성공정보 수신',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {type: 'Array', description: '파일정보', example: [
                    {
                        "file_seq": 5,
                        "file_path": "/test/path/filenam321214e.jpg"
                    }
                ]}
            },
            required: ['files']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            result: {type: 'Array', description: '파일 업로드 성공정보', example: [
                {
                    "file_seq": "파일번호",
                    "success": true
                }
            ]},
            success_file_seqs: {type: 'Array', description: '업로드 성공한 파일번호 목록', example: [
                1,2,3,4
            ]}
        }
    }})
    @ApiResponse({ status: 400, description: '실패', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 400},
            message: {type: 'string', description: '메세지', example: '메세지'},
            errors: {type: 'object', description: '유효성검사 반려정보', example: [
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
    async successUploadPresignedUrl(@Req() req: Request, @Res() res: Response, @Body() data: FilesSuccessUploadPresignedUrlDTO): Promise<object> {
        const dto = new FilesSuccessUploadPresignedUrlDTO(data);
        const result = await this.service.successUploadPresignedUrl(dto);
        return res.status(result['statusCode']).send(result);
    }
}