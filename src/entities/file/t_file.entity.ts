import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: 't_file', comment: '파일정보'})
export class File {
    @PrimaryGeneratedColumn({name: 'file_seq', primaryKeyConstraintName: 'PK_File', comment: '파일번호'})
    file_seq: number;

    @Column({name: 'file_uuid', nullable: false, update: false, comment: '파일 uuid', length: 100})
    file_uuid: string;

    @Column({name: 'file_o_nm', nullable: false, update: false, comment: '파일 원본명', length: 100})
    file_o_nm: string

    @Column({name: 'file_nm', nullable: false, update: false, comment: '파일명', length: 100})
    file_nm: string;

    @Column({name: 'file_path', nullable: true, update: true, comment: '파일경로', length: 255})
    file_path: string;

    @Column({name: 'file_ext', nullable: false, update: false, comment: '파일 확장자', length: 10})
    file_ext: string;

    @Column({name: 'file_size', nullable: true, update: true, comment: '파일크기', length: 15})
    file_size: string;

    @Column({name: 'mime_type', nullable: true, update: false, comment: '파일종류', length: 10})
    mime_type: string;

    @Column({name: 'thumb_yn', nullable: false, default: 'N', comment: '썸네일 존재여부', length: 1})
    thumb_yn: string;

    @Column({name: 'upload_yn', nullable: false, default: 'N', comment: '파일 업로드 성공여부', length: 1})
    upload_yn: string;

    @Column({name: 'use_yn', nullable: false, default: 'Y', comment: '사용여부', length: 1})
    use_yn: string;

    @Column({name: 'reg_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '등록일'})
    reg_dt: Date;

    @Column({name: 'mod_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '수정일', onUpdate: 'CURRENT_TIMESTAMP'})
    mod_dt: Date;
}