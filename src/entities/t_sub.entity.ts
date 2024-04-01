import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Main } from './t_main.entity';

@Entity('t_sub')
export class Sub {
    @PrimaryGeneratedColumn({name: 'sub_seq'})
    sub_seq: number = null;

    @ManyToOne(() => Main, main => main.seq, { nullable: false, cascade: true})
    @JoinColumn({name: 'seq', referencedColumnName: 'seq'})
    seq: Number = null;

    @Column({name: 'data_1', nullable: false, length: 30})
    data_1: string = null;

    @Column({name: 'data_2', nullable: false, length: 30})
    data_2: string = null;

    @Column({name: 'data_3', nullable: false, length: 30})
    data_3: string = null;

    constructor(data: any) {
        this.sub_seq = data && 'number' === typeof data.sub_seq ? data.sub_seq : this.sub_seq;
        this.seq = data && 'number' === typeof data.seq ? data.seq : this.seq;
        this.data_1 = data && 'string' === typeof data.data_1 ? data.data_1 : this.data_1;
        this.data_2 = data && 'string' === typeof data.data_2 ? data.data_2 : this.data_2;
        this.data_3 = data && 'string' === typeof data.data_3 ? data.data_3 : this.data_3;
    }
}