/* eslint-disable */

import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TokenService } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import { BrandRepo, BrandModel, UserModel, UserRepo, RevokeTokenSchema, RevokeToken } from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokeTokenRepository } from 'src/DB/repos/revokeToken.repository';
import { S3Service } from 'src/service/s3.service';

@Module({
  imports: [
    UserModel,
    BrandModel,
    MongooseModule.forFeature([
      { name: RevokeToken.name, schema: RevokeTokenSchema }, 
    ]),
  ],
  controllers: [BrandController],
  providers: [
    BrandService,
    TokenService,
    JwtService,
    UserRepo,
    BrandRepo,
    RevokeTokenRepository,
    S3Service
  ],
})
export class BrandModule {}
