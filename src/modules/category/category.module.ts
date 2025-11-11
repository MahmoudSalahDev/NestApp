/* eslint-disable */

import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { TokenService } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import {
  BrandRepo,
  BrandModel,
  UserModel,
  UserRepo,
  RevokeTokenSchema,
  RevokeToken,
  CategoryRepo,
  CategoryModel,
} from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokeTokenRepository } from 'src/DB/repos/revokeToken.repository';
import { S3Service } from 'src/service/s3.service';
import { CategoryService } from './category.service';

@Module({
  imports: [
    UserModel,
    CategoryModel,
    BrandModel,
    MongooseModule.forFeature([
      { name: RevokeToken.name, schema: RevokeTokenSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    TokenService,
    JwtService,
    UserRepo,
    BrandRepo,
    RevokeTokenRepository,
    S3Service,
    CategoryRepo,
  ],
})
export class CategoryModule {}
