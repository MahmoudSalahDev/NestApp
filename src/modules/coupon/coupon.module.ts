/* eslint-disable */

import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { TokenService } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import { CouponRepo, CouponModel, UserModel, UserRepo, RevokeTokenSchema, RevokeToken } from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokeTokenRepository } from 'src/DB/repos/revokeToken.repository';
import { S3Service } from 'src/service/s3.service';

@Module({
  imports: [
    UserModel,
    CouponModel,
    MongooseModule.forFeature([
      { name: RevokeToken.name, schema: RevokeTokenSchema }, 
    ]),
  ],
  controllers: [CouponController],
  providers: [
    CouponService,
    TokenService,
    JwtService,
    UserRepo,
    CouponRepo,
    RevokeTokenRepository,
    S3Service
  ],
})
export class CouponModule {}
