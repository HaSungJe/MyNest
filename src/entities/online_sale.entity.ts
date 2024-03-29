import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserInfo } from './user_info.entity';

@Entity()
export class OnlineSale {
    @PrimaryGeneratedColumn()
    online_sale_id: number;

    @Column()
    product_id: number;

    @Column()
    sales_amount: number;

    @Column({ type: 'date' })
    sales_date: Date;

    @ManyToOne(() => UserInfo, userInfo => userInfo.onlineSales)
    user: UserInfo;
}