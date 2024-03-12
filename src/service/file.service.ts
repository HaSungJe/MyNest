import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as moment from 'moment';

@Injectable()
export class FileService {
    // 파일업로드
    async upload(files: Express.Multer.File[]): Promise<any> {
        for (let i=0; i<files.length; i++) {
            const s3 = new S3({
                region: process.env.AWS_S3_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_SECRET_KEY
                }
            });
            const params = {
                Bucket: 'myfileserver',
                Key: `${moment().format('YYYYMMDDHHmmssSSS')}_${files[i].originalname}`,
                Body: files[i].buffer,
            };

            try {
                const result = await s3.upload(params).promise();
                files[i]['aws_s3'] = result;
            } catch (err) {
                files[i]['err'] = err.toString()
            }
        }

        return files;
    }
}
