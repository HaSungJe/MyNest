import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

// 로그인시 허가
@Injectable()
export class LoginInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle();

        // const req = context.switchToHttp().getRequest();
        // let token = req.headers['accessToken'];

        // if (!token) {
        //     throw new HttpException({code: 'NOT_AUTH_TOKEN', message: '로그인이 필요한 서비스입니다.'}, HttpStatus.UNAUTHORIZED);
        // } else {
        //     let data = util.viewJWTToken(req.headers.token.toString(), process.env.JWT_CODE);
        //     if (data) {
        //         if (data === 'TokenExpiredError') {
        //             throw new HttpException({code: 'EXPIRE_AUTH_TOKEN', message: '로그인 정보가 만료되었습니다.'}, HttpStatus.UNAUTHORIZED);
        //         } else if (data['type'] !== 'access') {
        //             throw new HttpException({code: 'FAIL_AUTH_TOKEN', message: '로그인 정보가 올바르지 않습니다.'}, HttpStatus.UNAUTHORIZED);
        //         }

        //         req.headers.user_info = data;
        //         return next.handle();
        //     } else {
        //         throw new HttpException({code: 'FAIL_AUTH_TOKEN', message: '로그인 정보가 올바르지 않습니다.'}, HttpStatus.UNAUTHORIZED);
        //     }
        // }
    }
}