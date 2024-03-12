import { BadRequestException, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { FileService } from '../service/file.service';  

@Controller('file')
export class FileController {
    constructor(private readonly service: FileService) {}

    // 파일업로드
    @Post("upload")
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB 제한
        },
    }))
    async upload(@UploadedFiles() files: Express.Multer.File[]) {
        try {
            let result = await this.service.upload(files);
            let fails = [];
            for (let i=0; i<result.length; i++) {
                if (result[i].aws_s3 === undefined) {
                    fails.push({
                        fileName: result[i].originalname,
                        size: result[i].size,
                        err: result[i].err
                    });
                }
            }

            return {
                success: true,
                success_count: result.length-fails.length,
                fail_count: fails.length
            }
        } catch (error) {
            if (error instanceof BadRequestException && error.message.includes('file size')) {
                return { message: '파일 크기는 최대 5MB 입니다.' };
            }
            throw error;
        }
    }

    // 파일업로드(디스크에 저장)
    @Post("upload_disk")
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB 제한
        },
    }))
    async upload_disk(@UploadedFiles() files: Express.Multer.File[]) {
        try {
            console.log(files[0])

            return { message: 'Files uploaded successfully' };
        } catch (error) {
            if (error instanceof BadRequestException && error.message.includes('file size')) {
                return { message: '파일 크기는 최대 5MB 입니다.' };
            }
            throw error;
        }
    }


}

