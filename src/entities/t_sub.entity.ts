import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Main } from './t_main.entity';

@Entity('t_sub')
export class Sub {
    @PrimaryGeneratedColumn({name: 'sub_seq'})
    sub_seq: number

    @ManyToOne(() => Main, main => main.seq, { nullable: false, cascade: true})
    @JoinColumn({name: 'seq', referencedColumnName: 'seq'})
    seq: Number

    @Column({name: 'data_1', nullable: false})
    data_1: string

    @Column({name: 'data_2', nullable: false})
    data_2: string

    @Column({name: 'data_3', nullable: false})
    data_3: string
}