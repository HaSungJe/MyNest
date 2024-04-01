import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Timestamp, UpdateDateColumn } from 'typeorm';
import { Sub } from './t_sub.entity';

@Entity('t_main')
export class Main {
    @PrimaryGeneratedColumn({name: 'seq'})
    seq: number = null;

    @Column({name: 'reg_dt', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    reg_dt: Timestamp;

    @UpdateDateColumn({name: 'mod_dt', type: 'timestamp', nullable: false})
    mod_dt: Timestamp;

    @Column({name: 'ip', nullable: false, length: 30})
    ip: string = null;

    @OneToMany(() => Sub, sub => sub.seq)
    sub: Sub[]

    constructor(data: any) {
        this.seq = data && 'number' === typeof data.seq ? data.seq : this.seq;
        this.ip = data && 'string' === typeof data.ip ? data.ip : this.ip;
    }
}