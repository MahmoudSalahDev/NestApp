import { Injectable } from "@nestjs/common";
import {  Cart } from "../Models";
import { DBRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class CartRepo extends DBRepo<Cart>{
    constructor(@InjectModel(Cart.name) protected override readonly model: Model<Cart>){
        super(model)
    }
}