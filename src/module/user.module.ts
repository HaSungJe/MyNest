import { Module } from '@nestjs/common';
import { TypeORMModule } from './typeorm.module';
import { LoginUserController, UserController } from '@root/api/user/user.controller';
import { UserService } from '@root/api/user/user.service';
import { UserSQL } from '@root/api/user/user.sql';

@Module({
    imports: [TypeORMModule],
    exports: [UserService, UserSQL],
    controllers: [UserController, LoginUserController],
    providers: [UserService, UserSQL],
})

export class UserModule {}
