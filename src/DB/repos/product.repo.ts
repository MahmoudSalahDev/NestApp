import { Injectable } from "@nestjs/common";
import { Product } from "../Models";
import { DBRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class ProductRepo extends DBRepo<Product>{
    constructor(@InjectModel(Product.name) protected override readonly model: Model<Product>){
        super(model)
    }
}