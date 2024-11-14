import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as util from '@util/util';
import { DataSource } from 'typeorm';

// 관리자 허가
@Injectable()
export class AdminInterceptor implements NestInterceptor {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const token: string = req.headers['accesstoken'];

        if (!token) {
            throw new HttpException({code: 'NOT_AUTH_TOKEN', message: '로그인이 필요한 서비스입니다.'}, HttpStatus.UNAUTHORIZED);
        } else {
            const data = util.viewJWTToken(token, process.env.JWT_CODE);
            if (data) {
                if (data === 'TokenExpiredError') {
                    throw new HttpException({code: 'EXPIRE_AUTH_TOKEN', message: '로그인 정보가 만료되었습니다.'}, HttpStatus.UNAUTHORIZED);
                } else if (data['type'] !== 'access') {
                    throw new HttpException({code: 'FAIL_AUTH_TOKEN', message: '로그인 정보가 올바르지 않습니다.'}, HttpStatus.UNAUTHORIZED);
                } else {
                    const builder = this.dataSource.createQueryBuilder();
                    builder.select(`
                          u.user_seq
                        , u.auth_code
                        , u.user_name
                        , u.user_nickname
                        , u.user_mobile
                    `)
                    builder.from(`t_user`, 'u');
                    builder.where('u.user_seq = :user_seq', {user_seq: data.user_seq});
                    builder.andWhere(`u.use_yn = 'Y'`);
                    const user = await builder.getRawOne();
                    if (!user) {
                        throw new HttpException({code: 'NO_SEARCH_USER', message: '회원 정보를 찾을 수 없습니다.'}, HttpStatus.BAD_REQUEST);
                    } else if (!['ADMIN', 'SUPER_ADMIN'].includes(user['auth_code'])) {
                        throw new HttpException({statusCode: 403, message: '권한이 없습니다.'}, HttpStatus.FORBIDDEN);
                    }

                    req.headers.user_info = user;
                    return next.handle();
                }
            } else {
                throw new HttpException({code: 'FAIL_AUTH_TOKEN', message: '로그인 정보가 올바르지 않습니다.'}, HttpStatus.UNAUTHORIZED);
            }
        }
    }
}