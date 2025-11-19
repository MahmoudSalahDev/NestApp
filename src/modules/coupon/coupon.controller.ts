/* eslint-disable */
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './coupon.dto';
import { Auth, User } from 'src/common/decorators';
import { TokenType, UserRole } from 'src/common/enums';
import type { HUserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/utils/multer/multer.cloud';
import { fileValidation } from 'src/utils/multer/multer.fileVal';
import { Types } from 'mongoose';

@Controller('coupon')
export class CouponController {

    constructor(private readonly CouponService: CouponService) { }


    @Auth({
        role: [UserRole.admin, UserRole.user],
        tokenType: TokenType.access
    })
    @Post()
    async createCoupon(
        @Body() body: CreateCouponDto,
        @User() user: HUserDocument,
    ) {
        const Coupon = await this.CouponService.createCoupon(body, user);
        return { message: 'done', Coupon }
    }

    @Auth({
        role: [UserRole.admin, UserRole.user],
        tokenType: TokenType.access,
    })
    @Patch(':id')
    async updateCoupon(
        @Param('id') id: string,
        @Body() body: UpdateCouponDto,
        @User() user: HUserDocument,
    ) {
        if (!body || Object.keys(body).length === 0) {
            throw new BadRequestException("No data provided for update");
        }
        return await this.CouponService.updateCoupon(id, body, user);
    }


}
