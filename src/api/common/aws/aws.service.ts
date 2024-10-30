import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as UUID } from 'uuid';
import { FileGetPresignedUrlDTO } from '../file/file.dto';
import * as moment from 'moment';
import { AWSSql } from './aws.sql';

@Injectable()
export class AWSService {
    private readonly s3Client: S3Client;

    constructor(
        private readonly sql: AWSSql
    ) {
        this.s3Client = new S3Client({
            region: process.env.AWS_S3_REGION,
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
            }
        });
    }

    /**
     * 파일 업로드 URL 생성
     * 
     * @param path 
     * @param expires 
     * @returns 
     */
    async s3_createPresignedURL(path: string, expires: number): Promise<Object> {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: path,
        });

        try {
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: expires });
            return { statusCode: 200, url: url };
        } catch (error) {
            return { statusCode: 400 };
        }
    }

    /**
     * 파일 업로드 URL 얻기
     * 
     * @param dto 
     * @returns 
     */
    async s3_presignedURL(dto: FileGetPresignedUrlDTO): Promise<Array<object>> {
        const results = [];

        // 1. 디렉토리 생성
        const now = moment();
        const year = now.format('YYYY');
        const month = now.format('MM');
        const day = now.format('DD');
        const directory = `${process.env.AWS_S3_HEAD_PATH}/${dto.path_head}/${year}/${month}/${day}`;

        // 2. 파일정보 얻기
        for (let i = 0; i < dto.files.length; i++) {
            const uuid = UUID();
            const file = dto.files[i];
            const result = {
                file_name: file.file_name
            }

            const filePath = `${directory}/${uuid}.${file.file_ext}`;
            const url = await this.s3_createPresignedURL(filePath, 300);
            if (url['statusCode'] === 200) {
                const sqlResult = await this.sql.insertPresignedFile(uuid, file['file_name'], `${uuid}.${file.file_ext}`, file.file_ext, file.mime_type, file.file_size, file.thumb);
                if (sqlResult['statusCode'] === 200) {
                    result['url'] = {
                        success: true,
                        url: url['url'],
                        file_seq: sqlResult['file_seq']
                    }
                } else {
                    result['url'] = {
                        success: false
                    }
                }
            } else {
                result['url'] = {
                    success: false
                }
            }

            // 2. 썸네일 url 생성
            if (file['thumb'] === 'Y') {
                const thumbPath = `${directory}/s_${uuid}.${file.file_ext}`;
                const thumb_url = await this.s3_createPresignedURL(thumbPath, 300);
                if (thumb_url['statusCode'] === 200) {
                    result['thumb_url'] = {
                        success: true,
                        url: thumb_url['url']
                    }
                } else {
                    result['thumb_url'] = {
                        success: false
                    }
                }
            }

            results.push(result);
        }

        return results;
    }

    /**
     * S3 - 파일 존재여부
     * 
     * @param path 
     * @returns 
     */
    async s3_exist(path: string): Promise<boolean> {
        const command = new HeadObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: path
        });

        try {
            await this.s3Client.send(command);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * S3 - 파일 위치이동
     * 
     * @param path 
     * @param move_path 
     * @returns 
     */
    async s3_move(path: string, move_path: string) {
        try {
            // 파일복사
            await this.s3Client.send(new CopyObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                CopySource: `${process.env.AWS_S3_BUCKET}/${path}`,
                Key: move_path,
            }));

            // 원본파일 삭제
            await this.s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: path
            }));

            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    /**
     * S3 - 파일삭제
     * 
     * @param key 
     * @returns 
     */
    async s3_delete(key: string): Promise<any> {
        try {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key
            };

            await this.s3Client.send(new DeleteObjectCommand(params));
            return { statusCode: 200 };
        } catch (err) {
            return { statusCode: 400, message: err.toString() };
        }
    }
}