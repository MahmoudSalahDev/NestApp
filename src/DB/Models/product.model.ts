/* eslint-disable */
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";


export class ProductVariant {
    @Prop({ required: true, type: String })
    name: string; // e.g., "Red - L"

    @Prop({ type: Number })
    price?: number; // optional variant-specific price

    @Prop({ type: Number, default: 0 })
    quantity?: number; // stock for this variant
}


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class Product {

    @Prop({ required: true, type: String, minlength: 3, maxlength: 500, trim: true })
    name: string

    @Prop({ type: String, default: function () { return slugify(this.name, { replacement: "-", lower: true, trim: true }) } })
    slug: string

    @Prop({ required: true, type: String, minlength: 10, maxlength: 10000, trim: true })
    description: string

    @Prop({ required: true, type: String })
    mainImage: string

    @Prop({ type: [String] })
    subImages: string[]

    @Prop({ required: true, type: Number })
    price: number

    @Prop({ type: Number, min: 1, max: 100 })
    discount: number

    @Prop({ type: Number, min: 1 })
    quantity: number

    @Prop({ type: Number })
    stock: number

    @Prop({ type: Number })
    rateNum: number

    @Prop({ type: Number })
    rateAva: number

    @Prop({ required: true, type: Types.ObjectId, ref: "Brand" })
    brand: Types.ObjectId

    @Prop({ required: true, type: Types.ObjectId, ref: "Category" })
    category: Types.ObjectId

    @Prop({ type: [ProductVariant], default: [] })
    variants: ProductVariant[];

    // @Prop({ required: true, type: Types.ObjectId, ref: "SubCategory" })
    // subCategory: Types.ObjectId

    @Prop({ required: true, type: Types.ObjectId, ref: "User" })
    createdBy: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy: Types.ObjectId

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    restoredAt: Date

}


export type HProductDocument = HydratedDocument<Product>
export const ProductSchema = SchemaFactory.createForClass(Product)
ProductSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    const update = this.getUpdate() as UpdateQuery<Product>
    if (update.name) {
        update.slug = slugify(update.name, { replacement: "-", lower: true, trim: true });
    }
    next();
})
ProductSchema.pre(["findOne", "find", "findOneAndUpdate"], function (next) {
    const query = this.getQuery()
    const { paranoid, ...rest } = query
    if (paranoid === false) {
        this.setQuery({ ...rest, deletedAt: { $exists: true } })
    } else {
        this.setQuery({ ...rest, deletedAt: { $exists: false } })
    }
    next()
})
export const ProductModel = MongooseModule.forFeature([{
    name: Product.name,
    schema: ProductSchema
}])