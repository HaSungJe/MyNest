import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Timestamp, UpdateDateColumn } from 'typeorm';
import { Sub } from './t_sub.entity';

@Entity({name: 't_main', comment: '메인 테이블'})
export class Main {
    @PrimaryGeneratedColumn({name: 'seq', comment: '메인 식별자'})
    seq: number = null;

    @Column({name: 'reg_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', comment: '등록일'})
    reg_dt: Timestamp;

    @UpdateDateColumn({name: 'mod_dt', type: 'timestamp', nullable: false, comment: '수정일'})
    mod_dt: Timestamp;

    @Column({name: 'ip', nullable: false, length: 30, comment: 'ip'})
    ip: string = null;

    @OneToMany(() => Sub, sub => sub.seq)
    sub: Sub[]

    constructor(data: any) {
        this.seq = data && 'number' === typeof data.seq ? data.seq : this.seq;
        this.ip = data && 'string' === typeof data.ip ? data.ip : this.ip;
    }
}