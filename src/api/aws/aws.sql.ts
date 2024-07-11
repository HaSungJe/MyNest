import { Injectable } from "@nestjs/common";
import { File } from "@root/entities/file/t_file.entity";
import { DataSource } from "typeorm";

@Injectable()
export class AWSSql {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    /**
     * Presigned URL 업로드용 임시 파일정보 생성
     * 
     * @param file_uuid 
     * @param file_o_nm 
     * @param file_nm 
     * @param file_ext 
     * @param mime_type 
     * @param file_size 
     * @param thumb_yn 
     * @returns 
     */
    async insertPresignedFile(file_uuid: string, file_o_nm: string, file_nm: string, file_ext: string, mime_type: string, file_size: number, thumb_yn: string): Promise<object> {
        const conn = this.dataSource.createQueryRunner();
        await conn.startTransaction();

        try {
            const file = new File();
            file.file_uuid = file_uuid;
            file.file_o_nm = file_o_nm;
            file.file_nm = file_nm;
            file.file_ext = file_ext;
            file.mime_type = mime_type;
            file.file_size = file_size.toString();
            file.thumb_yn = thumb_yn === 'Y' ? 'Y' : 'N';
            file.use_yn = 'N';
            const result = await conn.manager.insert(File, file);

            await conn.commitTransaction();
            return { statusCode: 200, file_seq: result['identifiers'][0]['file_seq'] }
        } catch (error) {
            await conn.rollbackTransaction();
            return { statusCode: 400 }
        } finally {
            await conn.release();
        }
    }
}