import { Module } from '@nestjs/common';
import { TypeORMModule } from '../common/typeorm.module';
import { UserSQL } from '@root/api/v1/user/user.sql';
import { LoginUserController, UserController } from '@root/api/v1/user/user.controller';
import { UserService } from '@root/api/v1/user/user.service';

@Module({
    imports: [TypeORMModule],
    exports: [UserService, UserSQL],
    controllers: [UserController, LoginUserController],
    providers: [UserService, UserSQL],
})

export class UserModule {}
