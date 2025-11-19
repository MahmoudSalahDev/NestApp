/* eslint-disable */

import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Types } from "mongoose";



export class UpdateQuantityDto {

    
    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    quantity: number

}


export class CreateCartDto extends UpdateQuantityDto {


    @IsMongoId()
    @IsNotEmpty()
    productId: Types.ObjectId

}




export class ParamDto{
    @IsMongoId()
    @IsNotEmpty()
    id:Types.ObjectId
}