/* eslint-disable */
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class CartProduct {

    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId

    @Prop({ type: Number, required: true })
    quantity: number

    @Prop({ type: Number, required: true })
    finalPrice: number

}


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class Cart {

    @Prop({ type: [CartProduct] })
    products: CartProduct[]

    @Prop({ required: true, type: Types.ObjectId, ref: "User" })
    createdBy: Types.ObjectId

    // @Prop({ type: Types.ObjectId, ref: "User" })
    // updatedBy: Types.ObjectId


    @Prop({ type: Number })
    subTotal: number

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    restoredAt: Date

}


export type HCartDocument = HydratedDocument<Cart>
export const CartSchema = SchemaFactory.createForClass(Cart)
CartSchema.pre(["save"], async function (next) {
    this.subTotal = this.products.reduce((total, product) => total + (product.quantity * product.finalPrice), 0)
    next();
})
CartSchema.pre(["findOne", "find", "findOneAndUpdate"], function (next) {
    const query = this.getQuery()
    const { paranoid, ...rest } = query
    if (paranoid === false) {
        this.setQuery({ ...rest, deletedAt: { $exists: true } })
    } else {
        this.setQuery({ ...rest, deletedAt: { $exists: false } })
    }
    next()
})
export const CartModel = MongooseModule.forFeature([{
    name: Cart.name,
    schema: CartSchema
}])