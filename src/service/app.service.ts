import { Injectable } from '@nestjs/common';
import { Entities } from '../entities/entities';

@Injectable()
export class AppService {
    constructor(
        private readonly entities: Entities
    ) {}

    getJson(): object {
        return {
            success: true,
            message: 'Hellow World !'
        }
    }

    async typeorm() {
        return {
            find: await this.entities.userInfoRepo.find()
        }
    }
}
