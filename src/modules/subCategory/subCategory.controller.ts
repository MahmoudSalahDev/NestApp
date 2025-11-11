/* eslint-disable */
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Auth, User } from 'src/common/decorators';
import { TokenType, UserRole } from 'src/common/enums';
import type { HUserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/utils/multer/multer.cloud';
import { fileValidation } from 'src/utils/multer/multer.fileVal';
import { CreateSubCategoryDto, idDto, QueryDto, UpdateSubCategoryDto } from './subCategory.dto';
import { SubCategoryService } from './subCategory.service';

@Controller('subCategories')
export class SubCategoryController {

    constructor(private readonly SubCategoryService: SubCategoryService) { }


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileTypes: fileValidation.image })))
    @Post()
    async createSubCategory(
        @Body() SubCategoryDto: CreateSubCategoryDto,
        @User() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        const SubCategory = await this.SubCategoryService.createSubCategory(SubCategoryDto, user, file);
        return { message: 'done', SubCategory }
    }


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Patch('/update/:id')
    async updateSubCategory(
        @Param() params: idDto,
        @Body() SubCategoryDto: UpdateSubCategoryDto,
        @User() user: HUserDocument,
    ) {
        const SubCategory = await this.SubCategoryService.updateSubCategory(params.id, SubCategoryDto, user);
        return { message: 'done', SubCategory }
    }

    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileTypes: fileValidation.image })))
    @Patch('/updateImage/:id')
    async updateSubCategoryImage(
        @Param() params: idDto,
        @User() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        const SubCategory = await this.SubCategoryService.updateSubCategoryImage(params.id, file, user);
        return { message: 'done', SubCategory }
    }
    /////////////////////////////////////////////


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Delete('/freeze/:id')
    async freezeSubCategory(
        @Param() params: idDto,
        @User() user: HUserDocument,
    ) {
        const SubCategory = await this.SubCategoryService.freezeSubCategory(params.id, user);
        return { message: 'done', SubCategory }
    }
    ///////////////////////////////////////////


    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Patch('/restore/:id')
    async restoreSubCategory(
        @Param() params: idDto,
        @User() user: HUserDocument,
    ) {
        const SubCategory = await this.SubCategoryService.restoreSubCategory(params.id, user);
        return { message: 'done', SubCategory }
    }
////////////////////////////////////////////

    @Auth({
        role: [UserRole.admin],
        tokenType: TokenType.access
    })
    @Delete('/delete/:id')
    async deleteSubCategory(
        @Param() params: idDto,
    ) {
        const SubCategory = await this.SubCategoryService.deleteSubCategory(params.id);
        return { message: 'done', SubCategory }
    }
////////////////////////////////////////////



    @Get()
    async getAllSubCategories(
        @Query() query: QueryDto
    ) {
        const { currentPage, count, numberOfPages ,docs} = await this.SubCategoryService.getAllSubCategories(query);
        return { message: 'done',  currentPage, count, numberOfPages ,docs }
    }
////////////////////////////////////////////

}
