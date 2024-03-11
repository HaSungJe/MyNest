import { BadRequestException, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileService } from '../service/file.service';  

@Controller('file')
export class FileController {
    @Post("upload")
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
    async upload(@UploadedFiles() files: Express.Multer.File[]) {
        try {
            console.log(files);
            



            return { message: 'Files uploaded successfully' };
        } catch (error) {
            if (error instanceof BadRequestException && error.message.includes('file size')) {
                return { message: '파일 크기는 최대 5MB 입니다.' };
            }
            throw error;
        }
    }
}