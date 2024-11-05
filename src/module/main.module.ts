import { Module } from '@nestjs/common';
import { DashboardModule } from './v1/dashboard.module';
import { FileModule } from './common/file.module';

@Module({
    imports: [
        DashboardModule
    ]
})

export class MainModule {}
