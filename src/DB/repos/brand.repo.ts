import { Injectable } from "@nestjs/common";
import { Brand } from "../Models";
import { DBRepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class BrandRepo extends DBRepo<Brand>{
    constructor(@InjectModel(Brand.name) protected override readonly model: Model<Brand>){
        super(model)
    }
}