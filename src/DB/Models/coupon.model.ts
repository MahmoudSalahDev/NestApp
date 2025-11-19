/* eslint-disable */
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class Coupon {

    @Prop({ required: true, type: String, minlength: 3, maxlength: 50, trim: true, unique: true, lowercase: true })
    code: string

    @Prop({ type: Number, required: true })
    amount: number

    @Prop({ type: Date, required: true })
    fromDate: Date

    @Prop({ type: Date, required: true })
    toDate: Date

    @Prop({ type: [{type: Types.ObjectId, ref: "User", required: true }] })
    usedBy: Types.ObjectId[]

    @Prop({ required: true, type: Types.ObjectId, ref: "User" })
    createdBy: Types.ObjectId

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    restoredAt: Date

}


export type HCouponDocument = HydratedDocument<Coupon>
export const CouponSchema = SchemaFactory.createForClass(Coupon)
CouponSchema.pre(["findOne", "find", "findOneAndUpdate"], function (next) {
    const query = this.getQuery()
    const { paranoid, ...rest } = query
    if (paranoid === false) {
        this.setQuery({ ...rest, deletedAt: { $exists: true } })
    } else {
        this.setQuery({ ...rest, deletedAt: { $exists: false } })
    }
    next()
})
export const CouponModel = MongooseModule.forFeature([{
    name: Coupon.name,
    schema: CouponSchema
}])