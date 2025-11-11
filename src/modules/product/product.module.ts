/* eslint-disable */

import { Module } from '@nestjs/common';

import { TokenService } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import { UserModel, UserRepo, RevokeTokenSchema, RevokeToken, ProductModel, ProductRepo, BrandRepo, CategoryRepo, CategoryModel, BrandModel } from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokeTokenRepository } from 'src/DB/repos/revokeToken.repository';
import { S3Service } from 'src/service/s3.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    UserModel,
    ProductModel,
    CategoryModel,
    BrandModel,
    MongooseModule.forFeature([
      { name: RevokeToken.name, schema: RevokeTokenSchema }, 
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    TokenService,
    JwtService,
    UserRepo,
    ProductRepo,
    RevokeTokenRepository,
    S3Service,
    BrandRepo,
    CategoryRepo
  ],
})
export class ProductModule {}
