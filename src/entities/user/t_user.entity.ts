import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "./t_auth.entity";
import { Provider } from "./t_provider.entity";
import { Region } from "../region/t_region.entity";
import { State } from "./t_state.entity";

@Entity({name: 't_user', comment: '회원 정보'})
export class User {
    @PrimaryGeneratedColumn({name: 'user_seq', comment: '회원 번호', primaryKeyConstraintName: 'PK_User'})
    user_seq: number;

    @ManyToOne(() => Auth, auth => auth.auth_code, {nullable: false, onUpdate: "CASCADE", onDelete: "CASCADE"})
    @JoinColumn({name: 'auth_code', referencedColumnName: 'auth_code', foreignKeyConstraintName: 'User_FK_Auth'})
    auth_code: string;
    
    @ManyToOne(() => Provider, provider => provider.provider_code, {nullable: false, onUpdate: "CASCADE"})
    @JoinColumn({name: 'provider_code', referencedColumnName: 'provider_code', foreignKeyConstraintName: 'User_FK_Provider'})
    provider_code: string;

    @Column({name: 'provider_id', unique: true, update: false, nullable: true, comment: 'SNS 로그인 아이디', length: 100})
    provider_id: string;

    @ManyToOne(() => Region, region => region.region_code, { nullable: true, onUpdate: "CASCADE" })
    @JoinColumn({name: 'region_code', referencedColumnName: 'region_code', foreignKeyConstraintName: 'User_FK_Region'})
    region_code: string;

    @ManyToOne(() => State, state => state.state_code, { nullable: false, onUpdate: "CASCADE" })
    @JoinColumn({name: 'state_code', referencedColumnName: 'state_code', foreignKeyConstraintName: 'User_FK_State'})
    state_code: string;

    @Column({name: 'user_email', unique: true, update: false, nullable: false, comment: '이메일', length: 50})
    user_email: string;

    @Column({name: 'user_pw', nullable: false, comment: '비밀번호', length: 100})
    user_pw: string;

    @Column({name: 'user_name', nullable: true, comment: '이름', length: 20})
    user_name: string;

    @Column({name: 'user_nickname', nullable: true, unique: true, comment: '닉네임', length: 30})
    user_nickname: string;
    
    @Column({name: 'user_birth', nullable: true, comment: '생년월일', length: 10})
    user_birth: string;
    
    @Column({name: 'user_mobile', nullable: true, comment: '연락처', length: 20})
    user_mobile: string;

    @Column({name: 'user_gender', nullable: true, comment: '성별', length: 1})
    user_gender: string;
    
    @Column({name: 'user_zip', nullable: true, comment: '우편번호', length: 10})
    user_zip: string;

    @Column({name: 'user_addr1', nullable: true, comment: '주소', length: 30})
    user_addr1: string;

    @Column({name: 'user_addr2', nullable: true, comment: '상세주소', length: 30})
    user_addr2: string;

    @Column({name: 'ci', nullable: true, comment: 'CI', length: 255})
    ci: string;

    @Column({name: 'use_yn', nullable: false, comment: '사용여부', default: 'Y', length: 1})
    use_yn: string;
    
    @Column({name: 'reg_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '등록일'})
    reg_dt: Date;

    @Column({name: 'mod_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: '수정일'})
    mod_dt: Date;

    @Column({name: 'del_memo', nullable: true, comment: '탈퇴사유', length: 100})
    del_memo: string;
}