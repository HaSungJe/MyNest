import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sub } from './t_sub.entity';

@Entity('t_main')
export class Main {
    @PrimaryGeneratedColumn({name: 'seq',})
    seq: number

    @Column({name: 'reg_dt', type: 'date', nullable: false})
    reg_dt: Date

    @Column({name: 'mod_dt', type: 'date', nullable: false})
    mod_dt: Date

    @Column({name: 'ip', nullable: false})
    ip: string

    @OneToMany(() => Sub, sub => sub.seq)
    sub: Sub[]
}