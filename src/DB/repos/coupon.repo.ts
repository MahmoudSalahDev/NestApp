import { Injectable } from "@nestjs/common";
import { DBRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Coupon } from "../Models";


@Injectable()
export class CouponRepo extends DBRepo<Coupon>{
    constructor(@InjectModel(Coupon.name) protected override readonly model: Model<Coupon>){
        super(model)
    }
}