import { Module, SetMetadata } from '@nestjs/common';
import { TypeORMModule } from '../common/typeorm.module';
import { DashboardController } from '@root/api/dashboard/dashboard.controller';
import { DashboardService } from '@root/api/dashboard/dashboard.service';

@SetMetadata('path', 'dashboard')
@Module({
    imports: [TypeORMModule],
    exports: [DashboardService],
    controllers: [DashboardController],
    providers: [DashboardService],
})

export class DashboardModule {}
