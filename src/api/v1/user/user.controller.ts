import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Res, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { CheckEmailDTO, CheckNickDTO, UserAlarmDTO, UserLoginDTO, UserPatchBirthDTO, UserPatchNickDTO, UserPatchPWDTO, UserProfileDTO, UserPutDTO } from './user.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginInterceptor } from '@root/interceptor/auth.interceptor';
import * as requestIP from 'request-ip';

@ApiTags('회원')
@Controller('/api/user')
export class UserController {
    constructor(
        private readonly service: UserService
    ) {}

    /**
     * 로그인 Access 토큰 재발급
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Get('/refresh')
    @ApiOperation({
        summary: '로그인 Access 토큰 재발급',
        description: 'Headers에 Refresh Token을 Token으로 입력',
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            access_token: {type: 'string', description: '로그인 토큰(access)', example: "fndlkwnlfiqnblfiwqblkfwbkufqfwkjbtkqbflkwqnbflkbf123qkbtgqk"},
        }
    }})
    @ApiResponse({ status: 400, description: '실패', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 400},
            message: {type: 'string', description: '메세지', example: '메세지'}
        }
    }})
    async refresh(@Req() req: Request, @Res() res: Response) {
        const result = await this.service.refresh(requestIP.getClientIp(req), req.headers.token.toString());
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 일반 로그인
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Post('/login')
    @ApiOperation({
        summary: '일반 로그인',
        description: 'SNS 로그인을 제외한 로그인에 사용',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                user_email: {type: 'string', description: '이메일', example: 'test@naver.com'},
                user_pw: {type: 'string', description: '비밀번호', example: 'asdf1234'},
                day: {type: 'number', description: '로그인 유지일수. 1 ~ 365', example: 24}
            },
            required: ['user_email', 'user_pw']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            refresh_token: {type: 'string', description: '로그인 토큰(refresh)', example: "fndlkwnlfiqnblfiwqblkfwbkufqfwkjbtkqbflkwqnbfl1231kbfqkbtgqk"},
            access_token: {type: 'string', description: '로그인 토큰(access)', example: "fndlkwnlfiqnblfiwqblkfwbkufqfwkjbtkqbflkwqnbflkbf123qkbtgqk"},
        }
    }})
    @ApiResponse({ status: 400, description: '실패', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 400},
            message: {type: 'string', description: '메세지', example: '메세지'}
        }
    }})
    async login(@Req() req: Request, @Res() res: Response, @Body() data: UserLoginDTO): Promise<object> {
        const dto = new UserLoginDTO({...data, ip: requestIP.getClientIp(req), headers: req.headers});
        const result = await this.service.login(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 일반 회원가입
     * 
     * @param res 
     * @param data 
     * @returns 
     */
    @Put('/sign')
    @ApiOperation({
        summary: '일반 회원가입',
        description: 'SNS 회원가입을 제외한 회원가입에 사용',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                region_code: {type: 'string', description: '지역코드', example: '00'},
                user_email: {type: 'string', description: '이메일', example: 'test@naver.com'},
                user_name: {type: 'string', description: '이름', example: '김회원'},
                user_pw: {type: 'string', description: '비밀번호', example: '1234'},
                user_pw2: {type: 'string', description: '비밀번호 확인', example: '1234'},
                user_nickname: {type: 'string', description: '닉네임', example: '애국자'},
                user_birth: {type: 'string', description: '생년월일. [YYYY-MM-DD 형식]', example: '2000-01-01'},
                user_mobile: {type: 'string', description: '연락처. [000-0000-0000 형식]', example: '010-5555-4345'},
                user_gender: {type: 'string', description: '성별. [남성: M, 여성: F]. 기본값: F'},
                user_zip: {type: 'string', description: '우편번호', example: '12345'},
                user_addr1: {type: 'string', description: '주소', example: '울산 중구 서동 세영이노세븐'},
                user_addr2: {type: 'string', description: '상세주소', example: '613호'},
                ci: {type: 'string', description: '본인인증정보', example: 'aSfqljkfbqklfwkufqbkg'}
            },
            required: ['user_email', 'user_pw', 'user_pw2']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async sign(@Res() res: Response, @Body() data: UserPutDTO): Promise<object> {
        data.auth_code = 'USER';
        data.provider_code = 'EMAIL';
        const dto = new UserPutDTO(data);
        const result = await this.service.sign(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 이메일 중복확인
     * 
     * @param res 
     * @param data 
     * @returns 
     */
    @Post('/check/email')
    @ApiOperation({
        summary: '이메일 중복확인',
        description: '이메일 중복확인',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                user_email: {type: 'string', description: '이메일', example: 'test@naver.com'}
            },
            required: ['user_email']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async checkEmail(@Res() res: Response, @Body() data: CheckEmailDTO): Promise<object> {
        const dto = new CheckEmailDTO(data);
        const result = await this.service.checkEmail(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 닉네임 중복확인
     * 
     * @param res 
     * @param data 
     * @returns 
     */
    @Post('/check/nick')
    @ApiOperation({
        summary: '닉네임 중복확인',
        description: '닉네임 중복확인',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                user_nickname: {type: 'string', description: '닉네임', example: '김별명'}
            },
            required: ['user_nickname']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async checkNick(@Res() res: Response, @Body() data: CheckNickDTO): Promise<object> {
        const dto = new CheckNickDTO(data);
        const result = await this.service.checkNick(dto);
        return res.status(result['statusCode']).send(result);
    }
}

// 로그인
@ApiTags('회원')
@Controller('/api/user')
@UseInterceptors(LoginInterceptor)
export class LoginUserController {
    constructor(
        private readonly service: UserService
    ) {}

    /**
     * 회원 로그아웃
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Delete('/logout')
    @ApiOperation({
        summary: '회원 로그아웃',
        description: 'headers에 access_token 을 token으로 입력',
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
        }
    }})
    @ApiResponse({ status: 400, description: '실패', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 400},
            message: {type: 'string', description: '메세지', example: '메세지'}
        }
    }})
    async logout(@Req() req: Request, @Res() res: Response): Promise<object> {
        const result = await this.service.logout(req.headers['token'].toString());
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 회원 정보
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Get('/info')
    @ApiOperation({
        summary: '회원 정보',
        description: 'headers에 access_token 을 token으로 입력',
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            info: {type: 'object', description: '회원정보', example: {
                "user_seq":  "회원번호",
                "auth_code": "권한 코드",
                "auth_name": "권한명",
                "provider_code": "SNS로그인 코드",
                "provider_name": "SNS 로그인명",
                "provider_ename": "SNS 로그인 영문명",
                "region_code": "지역코드",
                "state_code": "상태코드",
                "state_name": "상태명",
                "state_content": "상태정보",
                "login_able_yn": "상태별 로그인 가능여부",
                "user_email": "이메일",
                "user_name": "이름",
                "user_nickname": "닉네임",
                "user_birth": "생년월일",
                "user_mobile": "연락처",
                "user_gender": "성별",
                "user_zip": "우편번호",
                "user_addr1": "주소",
                "user_addr2": "상세주소",
                "profile": {
                    "profile_image": "프로필 이미지주소",
                    "like_alarm_yn": "좋아요 알림 수신여부",
                    "comment_alarm_yn": "댓글 알림 수신여부",
                    "event_alarm_yn": "이벤트 알림 수신여부"
                }
            }}
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
    async info(@Req() req: Request, @Res() res: Response): Promise<object> {
        const result = await this.service.info(req.headers.user_info['user_email']);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 나를 팔로우한 회원 목록
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Get('/follow/me')
    @ApiOperation({
        summary: '나를 팔로우한 회원 목록',
        description: '나를 팔로우한 회원 목록',
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            list: {type: 'Array', description: '회원 목록', example: [
                {
                    "user_seq": "회원번호",
                    "user_nickname": "회원명"
                }
            ]}
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
    async getUserFollowMe(@Req() req: Request, @Res() res: Response): Promise<object> {
        const result = await this.service.getUserFollowMe(req.headers['user_info']['user_email']);
        return res.status(200).send({statusCode: 200, list: result});
    }

    /**
     * 내가 팔로우한 회원 목록
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Get('/follow/my')
    @ApiOperation({
        summary: '내가 팔로우한 회원 목록',
        description: '내가 팔로우한 회원 목록',
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            list: {type: 'Array', description: '회원 목록', example: [
                {
                    "user_seq": "회원번호",
                    "user_nickname": "회원명"
                }
            ]}
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
    async getUserFollowMy(@Req() req: Request, @Res() res: Response): Promise<object> {
        const result = await this.service.getUserFollowMy(req.headers['user_info']['user_email']);
        return res.status(200).send({statusCode: 200, list: result});
    }

    /**
     * 회원 팔로우 지정/해제
     * 
     * @param req 
     * @param res 
     * @param user_seq 
     * @returns 
     */
    @Post('/follow/:user_seq')
    @ApiOperation({
        summary: '회원 팔로우 지정/해제',
        description: '회원 팔로우 지정/해제',
    })
    @ApiParam({name: 'user_seq', description: '대상 회원번호'})
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200},
            follow_yn: {type: 'string', description: '팔로우 여부. [Y: 팔로우, N: 언팔로우]'}
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
    async switchUserFollow(@Req() req: Request, @Res() res: Response, @Param('user_seq') user_seq: number): Promise<object> {
        const result = await this.service.switchUserFollow(req.headers['user_info']['user_email'], user_seq);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 회원 프로필 사진 변경
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Patch('/profile')
    @ApiOperation({
        summary: '회원 프로필 사진 변경',
        description: '파일번호 미입력시 이미지 프로필 사진을 공백으로 처리',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file_seq: {type: 'number', description: '파일번호', example: 1}
            },
            required: []
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async patchUserProfile(@Req() req: Request, @Res() res: Response, @Body() data: UserProfileDTO): Promise<object> {
        data.user_info = req.headers['user_info'];
        const dto = new UserProfileDTO(data);
        const result = await this.service.patchUserProfile(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 회원 알림 수신정보 변경
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Patch('/alarm')
    @ApiOperation({
        summary: '회원 알림 수신정보 변경',
        description: '각 요소 미입력시 수신안함 처리',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                like_alarm_yn: {type: 'string', description: '좋아요 알림 수신여부. [Y: 수신, N: 수신안함]. 기본값: N', example: 'Y'},
                comment_alarm_yn: {type: 'string', description: '댓글 알림 수신여부. [Y: 수신, N: 수신안함]. 기본값: N', example: 'Y'},
                event_alarm_yn: {type: 'string', description: '이벤트 알림 수신여부. [Y: 수신, N: 수신안함]. 기본값: N', example: 'Y'},
            },
            required: []
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async patchUserAlarm(@Req() req: Request, @Res() res: Response, @Body() data: UserAlarmDTO): Promise<object> {
        data.user_info = req.headers['user_info'];
        const dto = new UserAlarmDTO(data);
        const result = await this.service.patchUserAlarm(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 회원 닉네임 변경
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Patch('/nick')
    @ApiOperation({
        summary: '회원 닉네임 변경',
        description: '회원 닉네임 변경',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                user_nickname: {type: 'string', description: '닉네임', example: '애국자'},
            },
            required: ['user_nickname']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async patchUserNick(@Req() req: Request, @Res() res: Response, @Body() data: UserPatchNickDTO): Promise<object> {
        data.user_info = req.headers['user_info'];
        const dto = new UserPatchNickDTO(data);
        const result = await this.service.patchUserNick(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 회원 생년월일 변경
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Patch('/birth')
    @ApiOperation({
        summary: '회원 생년월일 변경',
        description: '회원 생년월일 변경',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                user_birth: {type: 'string', description: '생년월일', example: '2000-01-01'},
            },
            required: ['user_birth']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async patchUserBirth(@Req() req: Request, @Res() res: Response, @Body() data: UserPatchBirthDTO): Promise<object> {
        data.user_info = req.headers['user_info'];
        const dto = new UserPatchBirthDTO(data);
        const result = await this.service.patchUserBirth(dto);
        return res.status(result['statusCode']).send(result);
    }

    /**
     * 회원 비밀번호 변경
     * 
     * @param req 
     * @param res 
     * @param data 
     * @returns 
     */
    @Patch('/password')
    @ApiOperation({
        summary: '회원 비밀번호 변경',
        description: '회원 비밀번호 변경',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                user_pw: {type: 'string', description: '비밀번호', example: '1234'},
                user_pw2: {type: 'string', description: '비밀번호 확인', example: '1234'},
            },
            required: ['user_pw', 'user_pw2']
        }
    })
    @ApiResponse({ status: 200, description: '성공', schema: {
        type: 'object',
        properties: {
            statusCode: {type: 'number', description: 'HTTP 상태코드', example: 200}
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
    async patchUserPW(@Req() req: Request, @Res() res: Response, @Body() data: UserPatchPWDTO): Promise<object> {
        data.user_info = req.headers['user_info'];
        const dto = new UserPatchPWDTO(data);
        const result = await this.service.patchUserPW(dto);
        return res.status(result['statusCode']).send(result);
    }
}