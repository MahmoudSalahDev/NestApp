import { Injectable } from "@nestjs/common";
import { Category } from "../Models";
import { DBRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class CategoryRepo extends DBRepo<Category>{
    constructor(@InjectModel(Category.name) protected override readonly model: Model<Category>){
        super(model)
    }
}