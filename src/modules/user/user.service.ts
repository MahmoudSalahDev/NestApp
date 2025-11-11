import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HUserDocument, UserRepo } from 'src/DB';
import { AddUserDto, ForgetPasswordDto, ResendOtpDto, ResetPasswordDto } from './user.dto';
import { Compare, Hash } from 'src/utils/hash';
import { generateOTP } from 'src/service/sendEmail';
import { eventEmmiter } from 'src/utils/event';
import { v4 as uuidv4 } from "uuid";
import { UserProvider, UserRole } from 'src/common/enums';
import { TokenService } from 'src/utils/token';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { S3Service } from 'src/service/s3.service';
/* eslint-disable */


@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly tokenService: TokenService,
        private readonly s3Service: S3Service,
    ) { }



    async addUser(body: AddUserDto) {
        let { fName, lName, email, password, age } = body

        const existing = await this.userRepo.findOne({ email });
        if (existing) {
            throw new BadRequestException('User already exists!!');
        }

        const hash = await Hash(password);
        const otp = await generateOTP();
        const hashedOtp = await Hash(String(otp));



        const user = await this.userRepo.create({
            fName,
            lName,
            email,
            password: hash,
            age,
            otp: hashedOtp,
        });

        eventEmmiter.emit('confirmEmail', { email, otp });

        return user;


    }

    async confirmEmail(email: string, otp: string) {
        const user = await this.userRepo.findOne({ email, confirmed: { $exists: false } });
        if (!user) {
            throw new NotFoundException('Email not found or already confirmed!');
        }

        const isValid = await Compare(otp, user.otp);
        if (!isValid) {
            throw new BadRequestException('Invalid OTP!');
        }

        await this.userRepo.updateOne(
            { email: user.email },
            { confirmed: true, $unset: { otp: '' } },
        );

        return { message: 'Email confirmed successfully 👌' };
    }

    async resendOtp(body: ResendOtpDto) {
        const { email } = body;

        // Check if user exists
        const user = await this.userRepo.findOne({
            email,
            confirmed: { $exists: false }
        });
        if (!user) {
            throw new BadRequestException('User not found! or already confirmed!!');
        }

        // Generate new OTP
        const otp = await generateOTP();
        const hashedOtp = await Hash(String(otp));

        // Update user OTP
        await this.userRepo.updateOne(
            { email },
            { $set: { otp: hashedOtp } }
        );

        // Emit the OTP email again
        eventEmmiter.emit('confirmEmail', { email, otp });

        return { message: 'OTP resent successfully' };
    }


    async signIn(email: string, password: string) {

        const user = await this.userRepo.findOne({
            email,
            confirmed: { $exists: true },
            provider: UserProvider.local,
        });

        if (!user) {
            throw new NotFoundException('Email not found, not confirmed, or invalid provider!');
        }

        const isMatch = await Compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid password!');
        }

        const jwtid = uuidv4();

        const access_token = await this.tokenService.generateToken({
            payload: { id: user._id, email },
            signature:
                user.role === UserRole.user
                    ? process.env.ACCESS_TOKEN_USER!
                    : process.env.ACCESS_TOKEN_ADMIN!,
            options: { expiresIn: '1h', jwtid },
        });

        const refresh_token = await this.tokenService.generateToken({
            payload: { id: user._id, email },
            signature:
                user.role === UserRole.user
                    ? process.env.REFRESH_TOKEN_USER!
                    : process.env.REFRESH_TOKEN_ADMIN!,
            options: { expiresIn: '1y', jwtid },
        });

        return {
            message: 'User logged in successfully 👌',
            access_token,
            refresh_token,
        };
    }

    async forgetPassword(dto: ForgetPasswordDto) {
        const { email } = dto;

        const user = await this.userRepo.findOne({
            email,
            confirmed: { $exists: true },
        });

        if (!user) {
            throw new NotFoundException('Email not found or not confirmed!');
        }

        const otp = await generateOTP();
        const hashedOtp = await Hash(String(otp));

        eventEmmiter.emit('forgetPassword', { email, otp });

        await this.userRepo.updateOne({ email: user.email }, { otp: hashedOtp });

        return { message: 'Success — OTP sent to email.' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const { email, otp, password, cPassword } = dto;

        if (password !== cPassword) {
            throw new BadRequestException('Passwords do not match!');
        }

        const user = await this.userRepo.findOne({ email, otp: { $exists: true } });

        if (!user) {
            throw new NotFoundException('User not found or OTP missing!');
        }

        const validOtp = await Compare(otp, user.otp!);
        if (!validOtp) {
            throw new BadRequestException('Invalid OTP');
        }

        const hashedPassword = await Hash(password);

        await this.userRepo.updateOne(
            { email: user.email },
            { password: hashedPassword, $unset: { otp: '' } },
        );

        return { message: 'Password reset successful.' };
    }

    async loginWithGmail(idToken: string) {
        const client = new OAuth2Client();


        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID!,
        });

        const payload = ticket.getPayload() as TokenPayload;

        if (!payload?.email) {
            throw new BadRequestException('Invalid Google token');
        }

        const { email, email_verified, name = '', picture } = payload;


        const [fName = 'Google', lName = 'User'] = name.trim().split(' ').length > 1
            ? name.trim().split(' ')
            : [name.trim() || 'Google', 'User'];


        let user = await this.userRepo.findOne({ email });

        if (!user) {

            user = await this.userRepo.create({
                fName,
                lName,
                email,
                confirmed: email_verified,
                profileImage: picture,
                password: uuidv4(),
                provider: UserProvider.google,
                age: 18,
            });
        }

        if (user.provider === UserProvider.local) {
            throw new UnauthorizedException('Please log in using email and password.');
        }

        const jwtid = uuidv4();

        const access_token = await this.tokenService.generateToken({
            payload: { id: user._id, email },
            signature:
                user.role === UserRole.user
                    ? process.env.ACCESS_TOKEN_USER!
                    : process.env.ACCESS_TOKEN_ADMIN!,
            options: { expiresIn: '1h', jwtid },
        });

        const refresh_token = await this.tokenService.generateToken({
            payload: { id: user._id, email },
            signature:
                user.role === UserRole.user
                    ? process.env.REFRESH_TOKEN_USER!
                    : process.env.REFRESH_TOKEN_ADMIN!,
            options: { expiresIn: '1y', jwtid },
        });

        return {
            message: 'Logged in successfully with Google 👌',
            access_token,
            refresh_token,
            user,
        };
    }

    uploadFile (file:Express.Multer.File , user:HUserDocument){

        return this.s3Service.uploadFile({
            file,
            path:`users/${user._id}`,
        })



    }


}
