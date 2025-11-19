import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { S3Service } from './service/s3.service';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { SubCategoryModule } from './modules/subCategory/subCategory.module';
import { CartModule } from './modules/cart/cart.module';
import { CouponModule } from './modules/coupon/coupon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      isGlobal: true,
    }),
    UserModule,
    BrandModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    CartModule,
    CouponModule,
    MongooseModule.forRoot(process.env.MONGO_URL as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('DB connected successfully😁'));
        // connection.on('open', () => console.log('open'));
        // connection.on('disconnected', () => console.log('disconnected'));
        // connection.on('reconnected', () => console.log('reconnected'));
        // connection.on('disconnecting', () => console.log('disconnecting'));

        return connection;
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService , S3Service],
})
export class AppModule {
  
}
