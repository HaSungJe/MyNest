import { Controller, Get, Put, Query, Res } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { Response } from "express";
import { GetDataDTO } from "./dashboard.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "@root/schemas/user.schema";
import { Model } from "mongoose";

@Controller('/')
export class DashboardController {
    constructor(
        private readonly service: DashboardService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    // 기본
    @Get('/')
    async hello(@Res() res: Response, @Query() data: GetDataDTO): Promise<object> {
        const dto = new GetDataDTO(data);
        const result = await this.service.hello(dto);
        return res.status(200).send({});
    }

    @Get('/user')
    async getUser(@Res() res: Response, @Query() data: GetDataDTO): Promise<object> {
        const users = await this.userModel.find().exec();

        return res.status(200).send({users});
    }

    @Get('/user/put')
    async putUser(@Res() res: Response) {
        await new this.userModel({name: new Date().getTime(), age: 30}).save();

        return res.status(200).send({});
    }
}