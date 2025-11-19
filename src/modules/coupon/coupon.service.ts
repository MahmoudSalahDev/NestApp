/* eslint-disable */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCouponDto, UpdateCouponDto } from './coupon.dto';
import { CouponRepo, HUserDocument } from 'src/DB';
import { S3Service } from 'src/service/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class CouponService {

    constructor(
        private readonly CouponRepo: CouponRepo,
    ) {

    }


    async createCoupon(
        body: CreateCouponDto,
        user: HUserDocument,
    ) {
        const { code, amount, fromDate, toDate } = body

        const CouponExists = await this.CouponRepo.findOne({ code: code.toLowerCase() })

        if (CouponExists) {
            throw new ConflictException("Coupon  already exists")
        }




        const Coupon = await this.CouponRepo.create({
            code,
            amount,
            fromDate,
            toDate,
            createdBy: user._id
        })

        if (!Coupon) {
            throw new InternalServerErrorException("Failed to create Coupon")
        }

        return Coupon
    }


    async updateCoupon(
        id: string,
        body: UpdateCouponDto,
        user: HUserDocument,
    ) {
        console.log("BODY VALUE IS:", body);
        const coupon = await this.CouponRepo.findOne({ _id: id, createdBy: user._id });

        if (!coupon) {
            throw new NotFoundException("Coupon not found");
        }

        if (body.code) {
            const existing = await this.CouponRepo.findOne({
                code: body.code.toLowerCase(),
                _id: { $ne: id }
            });

            if (existing) {
                throw new ConflictException("Coupon code already exists");
            }
        }

        const updated = await this.CouponRepo.findOneAndUpdate(
            { _id: id },
            { $set: body },
            { new: true }
        );

        if (!updated) {
            throw new InternalServerErrorException("Failed to update coupon");
        }

        return updated;
    }



}
