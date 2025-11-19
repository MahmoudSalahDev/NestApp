/* eslint-disable */

import { Module } from '@nestjs/common';

import { TokenService } from 'src/utils/token';
import { UserModel, UserRepo, RevokeTokenSchema, RevokeToken, ProductModel, ProductRepo, CartRepo, CartModel } from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokeTokenRepository } from 'src/DB/repos/revokeToken.repository';
import { CartController } from './cart.controller';
import { CartService, } from './cart.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UserModel,
    CartModel,
    ProductModel,
    MongooseModule.forFeature([
      { name: RevokeToken.name, schema: RevokeTokenSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    TokenService,
    JwtService,
    UserRepo,
    CartRepo,
    RevokeTokenRepository,
    ProductRepo
  ],
})
export class CartModule { }
