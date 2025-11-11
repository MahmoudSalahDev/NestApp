import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators";
import { IdsMongo } from "src/common/decorators/category.decorators";




export class CreateCategoryDto {

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @IsNotEmpty()
    slogan: string

    @Validate(IdsMongo)
    @IsOptional()
    brands:Types.ObjectId[]

}

export class idDto {

    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId



}

@AtLeastOne(["name", "slogan"])
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {


}


export class QueryDto {

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number

    @IsString()
    @IsOptional() 
    search?: string

}