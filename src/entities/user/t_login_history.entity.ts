import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './t_user.entity';

@Entity({name: 't_login_history', comment: '로그인이력'})
export class LoginHistory {
    @PrimaryGeneratedColumn({name: 'login_seq', primaryKeyConstraintName: 'PK_LoginHistory', comment: '로그인번호'})
    login_seq: number;

    @ManyToOne(() => User, user => user.user_seq, { nullable: false, onUpdate: "CASCADE" })
    @JoinColumn({name: 'user_seq', referencedColumnName: 'user_seq', foreignKeyConstraintName: 'LoginHistory_FK_User'})
    user_seq: number;

    @Column({name: 'refresh_token', type: 'text', nullable: false, comment: 'Refresh 토큰'})
    refresh_token: string;

    @Column({name: 'access_token', type: 'text', nullable: false, comment: 'Access 토큰'})
    access_token: string;

    @Column({name: 'ip', nullable: false, comment: '로그인IP', length: 30})
    ip: string;

    @Column({name: 'device_type', nullable: false, default: 'W', comment: '디바이스 종류', length: 1})
    device_type: string;

    @Column({name: 'device_token', nullable: true, comment: '디바이스 토큰', length: 255})
    device_token: string;

    @Column({name: 'device_os', nullable: true, comment: '디바이스 OS', length: 10})
    device_os: string;

    @Column({name: 'refresh_token_start_dt', type: 'timestamp', nullable: false, comment: 'Refresh 토큰 생성시간'})
    refresh_token_start_dt: Date;

    @Column({name: 'refresh_token_end_dt', type: 'timestamp', nullable: false, comment: 'Refresh 토큰 만료시간'})
    refresh_token_end_dt: Date;

    @Column({name: 'access_token_start_dt', type: 'timestamp', nullable: false, comment: 'Access 토큰 생성시간'})
    access_token_start_dt: Date;

    @Column({name: 'access_token_end_dt', type: 'timestamp', nullable: false, comment: 'Access 토큰 만료시간'})
    access_token_end_dt: Date;

    @Column({name: 'use_yn', nullable: false, comment: '사용여부', default: 'Y', length: 1})
    use_yn: string;
}