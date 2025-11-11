/* eslint-disable */
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';
import { Auth, User } from 'src/common/decorators';
import { TokenType, UserRole } from 'src/common/enums';
import type { HUserDocument } from 'src/DB';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/utils/multer/multer.cloud';
import { fileValidation } from 'src/utils/multer/multer.fileVal';

@Controller('products')
export class ProductController {

    constructor(private readonly productService: ProductService) { }


    @Auth({
        role: [UserRole.user],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ], multerCloud({ fileTypes: fileValidation.image })))
    @Post()
    async createProduct(
        @Body() ProductDto: CreateProductDto,
        @User() user: HUserDocument,
        @UploadedFiles(ParseFilePipe) files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }
    ) {
        const Product = await this.productService.createProduct(ProductDto, user, files);
        return { message: 'done', Product }
    }



}
