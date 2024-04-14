import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class InterFace1 {
    @Field(() => String)
    year: string;

    @Field(() => String)
    month: string;

    @Field(() => Int)
    gender: number;

    @Field(() => String)
    users: string;
}