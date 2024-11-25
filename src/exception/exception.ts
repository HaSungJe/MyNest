import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * 413 - 데이터 크기
 */
@Catch(Error)
export class PayloadTooLargeExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        if (exception.message && exception.message.includes('request entity too large')) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();

            const errorResponse = {
                statusCode: 413,
                code: 'DATA_TO_LARGE',
                message: `한 요청당 제한된 크기를 초과하였습니다. [최대 ${process.env.PAYLOAD_LIMIT_SIZE}]`,
            };

            return response.status(HttpStatus.PAYLOAD_TOO_LARGE).send(errorResponse);
        }

        // 다른 예외 처리
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: '서버에서 오류가 발생했습니다.',
        });
    }
}