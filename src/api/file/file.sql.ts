import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { FilesSuccessUploadPresignedUrlDTO } from "./file.dto";
import * as errorFilter  from '@util/errorFilter';
import { File } from "@root/entities/file/t_file.entity";

@Injectable()
export class FileSQL {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    /**
     * 파일 업로드 성공정보 수신
     * 
     * @param dto 
     */
    async successUploadPresignedUrl(dto: FilesSuccessUploadPresignedUrlDTO): Promise<object> {
        const result = [];
        const success_file_seqs = [];

        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            for (let i=0; i<dto.files.length; i++) {
                const uploadFile = dto.files[i];
                const file = new File();
                file.file_path = uploadFile.file_path
                file.upload_yn = 'Y';
                file.use_yn = 'Y';
                
                try {
                    await conn.manager.update(File, uploadFile.file_seq, file);
                    success_file_seqs.push(uploadFile.file_seq);
                    result.push({
                        file_seq: uploadFile.file_seq,
                        success: true
                    });
                } catch (queryError) {
                    result.push({
                        file_seq: uploadFile.file_seq,
                        success: false
                    });
                }
            }

            await conn.commitTransaction();
            return { statusCode: 200, result, success_file_seqs: success_file_seqs };
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400, message: await errorFilter.errMessageFilter(this.dataSource, error) }
        } finally {
            await conn.release();
        }
    }
}