import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'api_keys' })
export class Key {
    @Prop({ required: true })
    api_key: string;
    
    @Prop({ required: true })
    user_seq: number;
    
    @Prop({ required: true })
    reg_dt: string;
}

export type KeyDocument = HydratedDocument<Key>;
export const KeySchema = SchemaFactory.createForClass(Key);