import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OnlineSale } from './online_sale.entity';

@Entity('user_info')
export class UserInfo {
    @PrimaryGeneratedColumn({name: 'user_id'})
    user_id: number = null;;

    @Column({name: 'gender'})
    gender: number = null;;

    @Column({name: 'age'})
    age: number = null;;

    @Column({name: 'joind', type: 'date'})
    joined: Date = null;;

    @OneToMany(() => OnlineSale, online_sales => online_sales.user_id)
    online_sales: OnlineSale[];
}