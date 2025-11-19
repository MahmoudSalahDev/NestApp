/* eslint-disable */

import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators";




export class CreateProductDto {

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @IsString()
    @MinLength(10)
    @MaxLength(10000)
    @IsNotEmpty()
    description: string



    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    price: number

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    @IsOptional()
    discount: number

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @Min(1)
    quantity: number

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    stock: number

    @IsMongoId()
    @IsNotEmpty()
    brand: Types.ObjectId

    @IsMongoId()
    @IsNotEmpty()
    category: Types.ObjectId

    // @IsMongoId()
    // @IsNotEmpty()
    // subCategory: Types.ObjectId

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    variants?: ProductVariantDto[];

}


@AtLeastOne(["name", "description", "price", "discount", "quantity", "stock", "brand", "category"])
export class updateProductDto extends PartialType(CreateProductDto) {



}


export class ParamDto {
    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId
}

export class ProductVariantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    price?: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    quantity?: number;
}
