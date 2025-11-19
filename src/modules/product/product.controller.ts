/* eslint-disable */
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ParamDto, updateProductDto } from './product.dto';
import { Auth, User } from 'src/common/decorators';
import { TokenType, UserRole } from 'src/common/enums';
import type { HUserDocument } from 'src/DB';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/utils/multer/multer.cloud';
import { fileValidation } from 'src/utils/multer/multer.fileVal';

@Controller('products')
export class ProductController {

    constructor(private readonly productService: ProductService) { }

    @Post()
    @Auth({
        role: [UserRole.user],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ], multerCloud({ fileTypes: fileValidation.image })))
    async createProduct(
        @Body() ProductDto: CreateProductDto,
        @User() user: HUserDocument,
        @UploadedFiles(ParseFilePipe) files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }
    ) {
        const Product = await this.productService.createProduct(ProductDto, user, files);
        return { message: 'done', Product }
    }


    @Put(':id')
    @Auth({
        role: [UserRole.user],
        tokenType: TokenType.access
    })
    async updateProduct(
        @Param() param: ParamDto,
        @Body() ProductDto: updateProductDto,
        @User() user: HUserDocument,
    ) {
        const Product = await this.productService.updateProduct(ProductDto, user, param.id);
        return { message: 'done', Product }
    }

    @Put(':id/attachments')
    @Auth({
        role: [UserRole.user],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ], multerCloud({ fileTypes: fileValidation.image })))
    async updateProductAttachments(
        @Param() param: ParamDto,
        @UploadedFiles(ParseFilePipe) files: { mainImage?: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ) {
        const Product = await this.productService.updateProductAttachments(param.id, files);
        return { message: 'done', Product }
    }

    @Post('WishList/:id')
    @Auth({
        role: [UserRole.user , UserRole.admin],
        tokenType: TokenType.access
    })
    async addToWishList(
        @Param()  param: ParamDto,
        @User() user: HUserDocument,
    ){
        const userExists =  await this.productService.addToWishList(param.id , user)
        return { message: 'done', userExists }
    }




}
