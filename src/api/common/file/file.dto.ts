import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsNumberString, Length } from "class-validator";

// Presigned URL 요청 파일정보
export class UploadFileDTO {
    @IsNotEmpty({message: '파일명을 입력해주세요.'})
    file_name: string;

    @IsNotEmpty({message: '확장자를 입력해주세요.'})
    file_ext: string;

    @IsNotEmpty({message: 'MIME 정보를 입력해주세요.'})
    mime_type: string;

    @IsNumber(undefined, {message: '파일 크기는 숫자여야합니다.'})
    @IsNotEmpty({message: '파일 크기가 없습니다.'})
    file_size: number;

    thumb: string;

    constructor(data: any) {
        if (data) {
            this.file_name = data['file_name'];
            this.file_ext = data['file_ext'];
            this.mime_type = data['mime_type'];
            this.file_size = data['file_size'];
            this.thumb = 'Y' === data['thumb'] ? 'Y' : 'N';
        }
    }
}

// Presigned URL 요청 전체정보
export class FileGetPresignedUrlDTO {
    path_head: string;

    @IsArray({message: '파일정보는 배열형태여야합니다.'})
    files: Array<UploadFileDTO> = [];

    @IsBoolean({message: '파일정보가 없습니다.'})
    check_file_size: boolean = true;

    constructor(data: any) {
        if (data) {
            this.path_head = ['Post', 'Profile'].includes(data['path_head']) ?  data['path_head'] : 'Post';

            if (Array.isArray(data['files'])) {
                for (let i=0; i<data['files'].length; i++) {
                    this.files.push(new UploadFileDTO(data['files'][i]));
                }
            }

            if (this.files.length === 0) {
                this.check_file_size = null;
            }
        }
    }
}

// Presigend URL으로 파일 업로드 성공시의 요청값
export class FileSuccessUploadPresignedUrlDTO {
    @IsNumber(undefined, {message: '파일정보가 올바르지 않습니다.'})
    @IsNotEmpty({message: '파일정보가 없습니다.'})
    file_seq: number;

    @IsNotEmpty({message: '파일경로가 없습니다.'})
    file_path: string;

    constructor(data: any) {
        if (data) {
            this.file_seq = data['file_seq'];
            this.file_path = data['file_path'];
        }
    }
}

// Presigend URL으로 파일 업로드 성공시의 요청값(다수)
export class FilesSuccessUploadPresignedUrlDTO {
    files: Array<FileSuccessUploadPresignedUrlDTO> = [];

    constructor(data: any) {
        if (data && Array.isArray(data['files'])) {
            for (let i=0; i<data['files'].length; i++) {
                this.files.push(new FileSuccessUploadPresignedUrlDTO(data['files'][i]));
            }
        }
    }
}