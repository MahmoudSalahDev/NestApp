import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword, Length, Max, Min, MinLength, ValidateIf, } from "class-validator";
/* eslint-disable */


import { IsMatch } from "src/common/decorators";


export class AddUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 20, { message: 'fName must be between 3 and 15 char' })
    fName: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 20, { message: 'lName must be between 3 and 15 char' })
    lName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    // @Validate(MatchFields)
    @ValidateIf((data: AddUserDto) => {
        return Boolean(data.password)
    })
    @IsMatch(['password'])
    cPassword: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(18)
    @Max(65)
    age: number;

}

export class addUserQueryDto {
    @IsString({ message: 'flag must be string' })
    @IsNotEmpty({ message: 'flag must not be empty' })
    flag: string;



}

export class ConfirmEmailDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    otp: string;
}

export class ResendOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ForgetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @MinLength(6)
    cPassword: string;
}