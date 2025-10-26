import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserGender, UserProvider, UserRole } from "src/common/enums";
/* eslint-disable */

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class User {
    @Prop({ type: String, required: true, minLength: 3, maxLength: 20, trim: true })
    fName: string;

    @Prop({
        type: String,
        required: function (this: User) {
            return this.provider === 'local';
        },
        minLength: 3,
        maxLength: 20,
        trim: true,
    })
    lName?: string;

    @Virtual({
        get() {
            return `${this.fName} ${this.lName}`;
        },
        set(v: string) {
            this.fName = v.split(" ")[0];
            this.lName = v.split(" ")[1];
        },
    })
    userName: string;

    @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ type: String, trim: true })
    password: string;

    @Prop({
        type: Number,
        required: function (this: User) {
            return this.provider === 'local';
        },
        min: 18,
        max: 65,
    })
    age?: number;

    @Prop({ type: Boolean })
    confirmed: boolean;

    @Prop({ type: String })
    otp: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.user })
    role: UserRole;

    @Prop({ type: String, enum: UserGender, default: UserGender.male })
    gender: UserGender;

    @Prop({ type: String, enum: UserProvider, default: UserProvider.local })
    provider: UserProvider;

    @Prop({ type: Date, default: Date.now })
    changeCredentialAt: Date;

    @Prop({ type: String })
    profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.path('password').required(function (this: any): boolean {
    return this.provider !== UserProvider.google;
} as any);

export type HUserDocument = HydratedDocument<User>;

export const UserModel = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
]);
