/* eslint-disable */
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, idDto, QueryDto, UpdateBrandDto } from './brand.dto';
import { Auth, User } from 'src/common/decorators';
import { TokenType, UserRole } from 'src/common/enums';
import type { HUserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/utils/multer/multer.cloud';
import { fileValidation } from 'src/utils/multer/multer.fileVal';
import { Types } from 'mongoose';

@Controller('brands')
export class BrandController {

    constructor(private readonly brandService: BrandService) { }


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileTypes: fileValidation.image })))
    @Post()
    async createBrand(
        @Body() brandDto: CreateBrandDto,
        @User() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        const brand = await this.brandService.createBrand(brandDto, user, file);
        return { message: 'done', brand }
    }


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Patch('/update/:id')
    async updateBrand(
        @Param() params: idDto,
        @Body() brandDto: UpdateBrandDto,
        @User() user: HUserDocument,
    ) {
        const brand = await this.brandService.updateBrand(params.id, brandDto, user);
        return { message: 'done', brand }
    }

    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileTypes: fileValidation.image })))
    @Patch('/updateImage/:id')
    async updateBrandImage(
        @Param() params: idDto,
        @User() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        const brand = await this.brandService.updateBrandImage(params.id, file, user);
        return { message: 'done', brand }
    }
    /////////////////////////////////////////////


    @Auth({
        role: [UserRole.user],
        tokenType: TokenType.access
    })
    @Delete('/freeze/:id')
    async freezeBrand(
        @Param() params: idDto,
        @User() user: HUserDocument,
    ) {
        const brand = await this.brandService.freezeBrand(params.id, user);
        return { message: 'done', brand }
    }
    ///////////////////////////////////////////


    @Auth({
        role: [UserRole.user],
        tokenType: TokenType.access
    })
    @Patch('/restore/:id')
    async restoreBrand(
        @Param() params: idDto,
        @User() user: HUserDocument,
    ) {
        const brand = await this.brandService.restoreBrand(params.id, user);
        return { message: 'done', brand }
    }
////////////////////////////////////////////

    @Auth({
        role: [UserRole.user],
        tokenType: TokenType.access
    })
    @Delete('/delete/:id')
    async deleteBrand(
        @Param() params: idDto,
    ) {
        const brand = await this.brandService.deleteBrand(params.id);
        return { message: 'done', brand }
    }
////////////////////////////////////////////



    @Get()
    async getAllBrands(
        @Query() query: QueryDto
    ) {
        const { currentPage, count, numberOfPages ,docs} = await this.brandService.getAllBrands(query);
        return { message: 'done',  currentPage, count, numberOfPages ,docs }
    }
////////////////////////////////////////////

}
