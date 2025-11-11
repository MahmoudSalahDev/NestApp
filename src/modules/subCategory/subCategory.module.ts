/* eslint-disable */
import { Module } from '@nestjs/common';
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
  SubCategoryModel,
} from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokeTokenRepository } from 'src/DB/repos/revokeToken.repository';
import { S3Service } from 'src/service/s3.service';
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryRepo } from 'src/DB/repos/subCategory.repo';
import { SubCategoryService } from './subCategory.service'; // ✅ You missed this import

@Module({
  imports: [
    UserModel,
    CategoryModel,
    SubCategoryModel,
    BrandModel,
    MongooseModule.forFeature([
      { name: RevokeToken.name, schema: RevokeTokenSchema },
    ]),
  ],
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService, 
    TokenService,
    JwtService,
    UserRepo,
    BrandRepo,
    RevokeTokenRepository,
    S3Service,
    CategoryRepo,
    SubCategoryRepo,
  ],
})
export class SubCategoryModule {}
