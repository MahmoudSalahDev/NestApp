import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators";




export class CreateSubCategoryDto {

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

    
    @IsMongoId()
    @IsNotEmpty()
    category:Types.ObjectId

}

export class idDto {

    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId



}

@AtLeastOne(["name", "slogan"])
export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {


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