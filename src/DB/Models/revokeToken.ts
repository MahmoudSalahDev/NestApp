/* eslint-disable */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
})
export class RevokeToken {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: String, required: true })
    tokenId: string;

    @Prop({ type: Date, required: true })
    expireAt: Date;
}

export type HRevokeTokenDocument = HydratedDocument<RevokeToken>;

export const RevokeTokenSchema = SchemaFactory.createForClass(RevokeToken);

export const RevokeTokenModel = MongooseModule.forFeature([
    { name: RevokeToken.name, schema: RevokeTokenSchema },
]);
