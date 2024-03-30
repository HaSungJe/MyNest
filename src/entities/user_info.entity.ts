import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OnlineSale } from './online_sale.entity';

@Entity('user_info')
export class UserInfo {
    @PrimaryGeneratedColumn({name: 'user_id'})
    user_id: number;

    @Column({name: 'gender'})
    gender: number;

    @Column({name: 'age'})
    age: number;

    @Column({name: 'joind', type: 'date'})
    joined: Date;

    @OneToMany(() => OnlineSale, online_sales => online_sales.user_id)
    online_sales: OnlineSale[];
}