/* eslint-disable */


import { IsDateString, IsNotEmpty, IsOptional, IsPositive, IsString, Max, MaxLength, Min, MinLength, Validate } from "class-validator";
import { CouponValidator } from "src/common/decorators/coupon.decorators";





export class CreateCouponDto {

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @IsNotEmpty()
    code: string

    @Min(3)
    @Max(10)
    @IsNotEmpty()
    @IsPositive()
    amount: number


    @IsDateString()
    @IsNotEmpty()
    @Validate(CouponValidator)
    fromDate: Date


    @IsDateString()
    @IsNotEmpty()
    toDate: Date

}


export class UpdateCouponDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    code?: string;

    @IsOptional()
    @Min(3)
    @Max(10)
    @IsPositive()
    amount?: number;

    @IsOptional()
    @IsDateString()
    @Validate(CouponValidator)
    fromDate?: Date;

    @IsOptional()
    @IsDateString()
    @Validate(CouponValidator)
    toDate?: Date;
}


