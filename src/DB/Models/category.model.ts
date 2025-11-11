/* eslint-disable */
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class Category {

    @Prop({ required: true, type: String, minlength: 3, maxlength: 50, trim: true, unique: true })
    name: string

    @Prop({ type: String, default: function () { return slugify(this.name, { replacement: "-", lower: true, trim: true }) } })
    slug: string

    @Prop({ required: true, type: String, minlength: 3, maxlength: 10, trim: true })
    slogan: string

    @Prop({ required: true, type: String })
    image: string

    @Prop({  type: String })
    assetFolderId: string

    @Prop([{ type: Types.ObjectId, ref: "Brand" }])
    brands: Types.ObjectId[]

    @Prop({ required: true, type: Types.ObjectId, ref: "User" })
    createdBy: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy: Types.ObjectId

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    restoredAt: Date

}


export type HCategoryDocument = HydratedDocument<Category>
export const CategorySchema = SchemaFactory.createForClass(Category)
CategorySchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    const update = this.getUpdate() as UpdateQuery<Category>
    if (update.name) {
        update.slug = slugify(update.name, { replacement: "-", lower: true, trim: true });
    }
    next();
})
CategorySchema.pre(["findOne", "find", "findOneAndUpdate"], function (next) {
    const query = this.getQuery()
    const { paranoid, ...rest } = query
    if (paranoid === false) {
        this.setQuery({ ...rest, deletedAt: { $exists: true } })
    } else {
        this.setQuery({ ...rest, deletedAt: { $exists: false } })
    }
    next()
})
export const CategoryModel = MongooseModule.forFeature([{
    name: Category.name,
    schema: CategorySchema
}])