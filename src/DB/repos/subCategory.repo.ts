import { Injectable } from "@nestjs/common";
import { SubCategory } from "../Models";
import { DBRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class SubCategoryRepo extends DBRepo<SubCategory>{
    constructor(@InjectModel(SubCategory.name) protected override readonly model: Model<SubCategory>){
        super(model)
    }
}