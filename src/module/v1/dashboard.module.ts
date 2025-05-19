import { Module, SetMetadata } from '@nestjs/common';
import { DashboardController } from '@root/api/dashboard/dashboard.controller';
import { DashboardService } from '@root/api/dashboard/dashboard.service';
import { MongoDBModule } from '../common/mongodb.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@root/schemas/user.schema';


@SetMetadata('description', '대시보드')
@SetMetadata('path', 'dashboard')
@Module({
    imports: [
        MongoDBModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    exports: [DashboardService],
    controllers: [DashboardController],
    providers: [DashboardService],
})

export class DashboardModule {}
