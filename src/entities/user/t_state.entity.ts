import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 't_state', comment: '회원 상태정보'})
export class State {
    @PrimaryGeneratedColumn({name: 'state_seq', primaryKeyConstraintName: 'PK_State', comment: '회원상태번호'})
    state_seq: number;

    @Column({name: 'state_code', unique: true, nullable: false, comment: '회원 상태코드', length: 2})
    state_code: string;

    @Column({name: 'state_name', nullable: false, comment: '회원상태', length: 10})
    state_name: string;

    @Column({name: 'state_content', nullable: false, comment: '회원상태 설명', length: 50})
    state_content: string;

    @Column({name: 'login_able_yn', nullable: false, comment: '로그인 가능 여부', length: 1})
    login_able_yn: string;
}