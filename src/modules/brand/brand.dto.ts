import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators";




export class CreateBrandDto {

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

}

export class idDto {

    @IsMongoId()
    @IsNotEmpty()
    id: Types.ObjectId



}

@AtLeastOne(["name", "slogan"])
export class UpdateBrandDto extends PartialType(CreateBrandDto) {


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