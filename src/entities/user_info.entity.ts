import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { OnlineSale } from './online_sale.entity';

@Entity()
export class UserInfo {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    gender: number;

    @Column()
    age: number;

    @Column({ type: 'date' })
    joined: Date;

    @OneToMany(() => OnlineSale, onlineSale => onlineSale.user)
    onlineSales: OnlineSale[];
}