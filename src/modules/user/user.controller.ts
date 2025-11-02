import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from './user.service';
import { AddUserDto, ConfirmEmailDto, ForgetPasswordDto, ResendOtpDto, ResetPasswordDto } from './user.dto';
import { Auth, User } from 'src/common/decorators';
import type { HUserDocument } from 'src/DB';
/* eslint-disable */

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    addUser(@Body() body: AddUserDto): any {
        return this.userService.addUser(body);
    }

    @Post('confirm-email')
    async confirmEmail(
        @Body() body: ConfirmEmailDto,
        @Res() res: Response,
    ) {
        const { email, otp } = body;
        const result = await this.userService.confirmEmail(email, otp);
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('resend-otp')
    async resendOtp(@Body() body: ResendOtpDto) {
        return this.userService.resendOtp(body);
    }

    @Post('sign-in')
    async signIn(
        @Body() body: { email: string; password: string },
        @Res() res: Response,
    ) {
        const { email, password } = body;
        const result = await this.userService.signIn(email, password);
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('forget-password')
    async forgetPassword(
        @Body() body: ForgetPasswordDto,
        @Res() res: Response,
    ) {
        const result = await this.userService.forgetPassword(body);
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('reset-password')
    async resetPassword(
        @Body() body: ResetPasswordDto,
        @Res() res: Response,
    ) {
        const result = await this.userService.resetPassword(body);
        return res.status(HttpStatus.OK).json(result);
    }


    @Post('loginWithGmail')
    async loginWithGmail(
        @Body() body: { idToken: string },
        @Res() res: Response,
    ) {
        const { idToken } = body;
        const result = await this.userService.loginWithGmail(idToken);
        return res.status(HttpStatus.OK).json(result);
    }

    @Auth()
    @Get('profile')
    async profile(
        @User() user:HUserDocument
    ) {
        return { message: 'profile' ,user}
        // return res.status(HttpStatus.OK).json(result);  
    }
}
