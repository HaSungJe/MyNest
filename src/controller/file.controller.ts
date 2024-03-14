import { BadRequestException, Controller, Req, Res, Get, Post, Delete, UploadedFiles, UseInterceptors, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { Request, Response } from 'express';
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

    // 파일삭제
    @Delete('delete')
    async delete(@Req() req: Request) {
        let files = req.body.files;

        if (!Array.isArray(files)) {
            return {
                success: false,
                err: '파일 정보가 올바르지 않습니다.'
            }
        }

        let result = await this.service.delete(files);
        let success_count = result.filter(e => e.delete).length
        return {
            success: true,
            success_count: success_count,
            fail_count: result.length-success_count,
        }
    }

    // 이미지보기
    @Get('/image/:file')
    async image(@Res() res: Response, @Param('file') file:string) {
        if (typeof file !== 'string' || file === "") {
            return {
                success: false,
                err: '파일 정보가 올바르지 않습니다.'
            }
        }
 
        let result = await this.service.image(file);
        res.set('Content-Type', 'image/jpeg');
        res.send(result.file)
    }

    // 파일업로드(디스크에 저장. 백업용)
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

