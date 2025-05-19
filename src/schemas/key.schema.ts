import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'api_keys' })
export class Key {
    @Prop({ required: true })
    api_key: string;
    
    @Prop({ required: true })
    user_seq: number;
    
    @Prop({ required: true })
    reg_dt: string;
}

export type KeyDocument = Key & Document;
export const KeySchema = SchemaFactory.createForClass(Key);