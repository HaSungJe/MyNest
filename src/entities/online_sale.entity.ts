import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserInfo } from './user_info.entity';

@Entity('online_sale')
export class OnlineSale {
    @PrimaryGeneratedColumn({name: 'online_sale_id'})
    online_sale_id: number;

    @ManyToOne(() => UserInfo, userInfo => userInfo.user_id)
    @JoinColumn({name: 'user_id', referencedColumnName: 'user_id'})
    user_id: UserInfo = null;

    @Column({name: 'product_id'})
    product_id: number = null;

    @Column({name: 'sales_amount'})
    sales_amount: number = null;

    @Column({name: 'sales_date', type: 'date'})
    sales_date: Date = null;
}