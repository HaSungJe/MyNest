import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
    getJson(): object {
        return {
            success: true,
            message: 'Hellow World !'
        }
    }
}
