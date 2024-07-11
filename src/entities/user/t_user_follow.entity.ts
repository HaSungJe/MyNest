import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./t_user.entity";

@Entity({name: 't_user_follow', comment: '회원의 팔로우정보'})
@Unique(['user_seq', 'target_user_seq'])
export class UserFollow {
    @PrimaryGeneratedColumn({name: 'user_follow_seq', type: 'bigint', comment: '회원 팔로우번호', primaryKeyConstraintName: 'PK_UserFollow'})
    user_follow_seq: number;

    @ManyToOne(() => User, user => user.user_seq, { nullable: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({name: 'user_seq', referencedColumnName: 'user_seq', foreignKeyConstraintName: 'User_FK_Follow'})
    user_seq: number;

    @ManyToOne(() => User, target => target.user_seq, { nullable: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({name: 'target_user_seq', referencedColumnName: 'user_seq', foreignKeyConstraintName: 'User_FK_FollowTarget'})
    target_user_seq: number;

    @Column({name: 'use_yn', nullable: false, comment: '사용여부', default: 'Y', length: 1})
    use_yn: string;
    
    @Column({name: 'reg_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '등록일'})
    reg_dt: Date;

    @Column({name: 'mod_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: '수정일'})
    mod_dt: Date;
}