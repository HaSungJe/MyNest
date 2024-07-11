import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 't_provider', comment: '로그인 공급자'})
export class Provider {
    @PrimaryGeneratedColumn({name: 'provider_seq', type: 'tinyint', comment: '로그인 공급자 식별자', primaryKeyConstraintName: 'PK_Provider'})
    provider_seq: number;

    @Column({name: 'provider_code', unique: true, nullable: false, comment: '로그인 공급자 코드', length: 10})
    provider_code: string;

    @Column({name: 'provider_name', nullable: false, comment: '로그인 공급자 한글명', length: 20})
    provider_name: string;

    @Column({name: 'provider_ename', nullable: false, comment: '로그인 공급자 영문명', length: 20})
    provider_ename: string;

    @Column({name: 'use_yn', nullable: false, comment: '사용여부', default: 'Y', length: 1})
    use_yn: string;
}