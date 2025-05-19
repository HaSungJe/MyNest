import { Module } from '@nestjs/common';
import { DashboardModule } from './v1/dashboard.module';

@Module({
    imports: [
        DashboardModule
    ]
})

export class MainModule {}
