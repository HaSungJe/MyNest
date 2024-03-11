import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getJson(): object {
        return {
            success: true,
            message: 'Hellow World !'
        }
    }
}
