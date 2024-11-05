import { Injectable } from "@nestjs/common";
import { GetDataDTO } from "./dashboard.dto";
import { validateOrReject } from "class-validator";
import * as util from '@util/util';

@Injectable()
export class DashboardService {
    /**
     * 인사
     * 
     * @param dto 
     * @returns 
     */
    async hello(dto: GetDataDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            return { statusCode: 200, message: `Hellow !!! ${dto.add_text ? dto.add_text : ''}` }
        } catch (error) {
            const validationError = await util.validationError(error);
            return { statusCode: 400, message: validationError[0]['message'], validationError }
        }
    }
}