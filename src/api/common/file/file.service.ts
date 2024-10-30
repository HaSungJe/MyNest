import { Injectable } from "@nestjs/common";
import { FileSQL } from "./file.sql";
import { FileGetPresignedUrlDTO, FilesSuccessUploadPresignedUrlDTO } from "./file.dto";
import { validateOrReject } from "class-validator";
import { AWSService } from "../aws/aws.service";
import * as util from '@util/util';

@Injectable()
export class FileService {
    constructor(
        private readonly sql: FileSQL,
        private readonly aws: AWSService
    ) {}

    /**
     * 파일 업로드 URL 얻기
     * 
     * @param dto 
     * @returns 
     */
    async getPresignedUrl(dto: FileGetPresignedUrlDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            for (let i=0; i<dto.files.length; i++) {
                await validateOrReject(dto.files[i]);
            }

            const result = await this.aws.s3_presignedURL(dto);
            return { statusCode: 200, list: result }
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }

    /**
     * 파일 업로드 성공정보 수신
     * 
     * @param dto 
     */
    async successUploadPresignedUrl(dto: FilesSuccessUploadPresignedUrlDTO): Promise<object> {
        try {
            await validateOrReject(dto);
            for (let i=0; i<dto.files.length; i++) {
                await validateOrReject(dto.files[i]);
            }

            return await this.sql.successUploadPresignedUrl(dto);
        } catch (error) {
            const errors = await util.validationError(error);
            return { statusCode: 400, message: errors[0]['message'], errors }
        }
    }
}