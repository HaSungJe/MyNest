import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./t_user.entity";
import { File } from "../file/t_file.entity";

@Entity({name: 't_profile', comment: '회원 프로필정보'})
@Unique(['user_seq'])
@Unique(['file_seq'])
export class Profile {
    @PrimaryGeneratedColumn({name: 'profile_seq', comment: '프로필 번호', primaryKeyConstraintName: 'PK_Profile'})
    profile_seq: number;

    @ManyToOne(() => User, user => user.user_seq, { nullable: false, onUpdate: "CASCADE" })
    @JoinColumn({name: 'user_seq', referencedColumnName: 'user_seq', foreignKeyConstraintName: 'Profile_FK_User'})
    user_seq: number;

    @ManyToOne(() => File, file => file.file_seq, { nullable: true })
    @JoinColumn({name: 'file_seq', referencedColumnName: 'file_seq', foreignKeyConstraintName: 'Profile_FK_File'})
    file_seq: number;

    @Column({name: 'like_alarm_yn', nullable: false, comment: '좋아요 알림 수신여부', default: 'N', length: 1})
    like_alarm_yn: string;

    @Column({name: 'comment_alarm_yn', nullable: false, comment: '댓글 알림 수신여부', default: 'N', length: 1})
    comment_alarm_yn: string

    @Column({name: 'event_alarm_yn', nullable: false, comment: '이벤트 알림 수신여부', default: 'N', length: 1})
    event_alarm_yn: string

    @Column({name: 'reg_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '등록일'})
    reg_dt: Date;

    @Column({name: 'mod_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '수정일', onUpdate: 'CURRENT_TIMESTAMP'})
    mod_dt: Date;
}