/* eslint-disable */
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Auth, User } from 'src/common/decorators';
import { TokenType, UserRole } from 'src/common/enums';
import type { HUserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/utils/multer/multer.cloud';
import { fileValidation } from 'src/utils/multer/multer.fileVal';
import { Types } from 'mongoose';
import { CategoryService } from './category.service';
import { CreateCategoryDto, idDto, QueryDto, UpdateCategoryDto } from './category.dto';

@Controller('Categories')
export class CategoryController {

    constructor(private readonly CategoryService: CategoryService) { }


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileTypes: fileValidation.image })))
    @Post()
    async createCategory(
        @Body() CategoryDto: CreateCategoryDto,
        @User() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        const Category = await this.CategoryService.createCategory(CategoryDto, user, file);
        return { message: 'done', Category }
    }


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Patch('/update/:id')
    async updateCategory(
        @Param() params: idDto,
        @Body() CategoryDto: UpdateCategoryDto,
        @User() user: HUserDocument,
    ) {
        const Category = await this.CategoryService.updateCategory(params.id, CategoryDto, user);
        return { message: 'done', Category }
    }

    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileTypes: fileValidation.image })))
    @Patch('/updateImage/:id')
    async updateCategoryImage(
        @Param() params: idDto,
        @User() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        const Category = await this.CategoryService.updateCategoryImage(params.id, file, user);
        return { message: 'done', Category }
    }
    /////////////////////////////////////////////


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Delete('/freeze/:id')
    async freezeCategory(
        @Param() params: idDto,
        @User() user: HUserDocument,
    ) {
        const Category = await this.CategoryService.freezeCategory(params.id, user);
        return { message: 'done', Category }
    }
    ///////////////////////////////////////////


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Patch('/restore/:id')
    async restoreCategory(
        @Param() params: idDto,
        @User() user: HUserDocument,
    ) {
        const Category = await this.CategoryService.restoreCategory(params.id, user);
        return { message: 'done', Category }
    }
////////////////////////////////////////////

    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Delete('/delete/:id')
    async deleteCategory(
        @Param() params: idDto,
    ) {
        const Category = await this.CategoryService.deleteCategory(params.id);
        return { message: 'done', Category }
    }
////////////////////////////////////////////



    @Get()
    async getAllCategories(
        @Query() query: QueryDto
    ) {
        const { currentPage, count, numberOfPages ,docs} = await this.CategoryService.getAllCategories(query);
        return { message: 'done',  currentPage, count, numberOfPages ,docs }
    }
////////////////////////////////////////////

}
