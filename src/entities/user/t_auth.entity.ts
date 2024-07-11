import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 't_auth', comment: '권한정보'})
export class Auth {
    @PrimaryGeneratedColumn({name: 'auth_seq', primaryKeyConstraintName: 'PK_Auth', comment: '권한번호'})
    auth_seq: number;

    @Column({name: 'auth_code', unique: true, nullable: false, comment: '권한코드', length: 20})
    auth_code: string;
    
    @Column({name: 'auth_name', nullable: false, comment: '권한명', length: 10})
    auth_name: string; 
}