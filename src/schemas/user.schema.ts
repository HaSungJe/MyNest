import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({collection: 'user'})
export class User {
    @Prop({ required: true })
    name: string;
    
    @Prop()
    age: number;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);