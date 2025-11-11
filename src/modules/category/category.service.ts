/* eslint-disable */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CategoryRepo, HUserDocument } from 'src/DB';
import { S3Service } from 'src/service/s3.service';
import { Types } from 'mongoose';
import { CreateCategoryDto, QueryDto, UpdateCategoryDto } from './category.dto';
import { randomUUID } from 'crypto';
import { BrandRepo } from 'src/DB';

@Injectable()
export class CategoryService {

    constructor(
        private readonly CategoryRepo: CategoryRepo,
        private readonly BrandRepo: BrandRepo,
        private readonly s3Service: S3Service,
    ) {

    }


    async createCategory(
        CategoryDto: CreateCategoryDto,
        user: HUserDocument,
        file: Express.Multer.File
    ) {
        const { name, slogan, brands } = CategoryDto

        const CategoryExists = await this.CategoryRepo.findOne({ name })

        if (CategoryExists) {
            throw new ConflictException("Category name already exists")
        }

        const strictIds = [...new Set(brands || [])]

        if (brands && (await this.BrandRepo.find({ filter: { _id: { $in: strictIds } } })).length != strictIds.length) {
            throw new NotFoundException("Brands not found")
        }

        const assetFolderId = randomUUID()

        const url = await this.s3Service.uploadFile({
            path: `Categories/${assetFolderId}`,
            file
        })

        const Category = await this.CategoryRepo.create({
            name,
            slogan,
            image: url,
            createdBy: user._id,
            assetFolderId,
            brands: strictIds
        })

        if (!Category) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException("Failed to create Category")
        }

        return Category
    }


    async updateCategory(
        id: Types.ObjectId,
        CategoryDto: UpdateCategoryDto,
        user: HUserDocument,
    ) {

        const { name, slogan, brands } = CategoryDto

        const Category = await this.CategoryRepo.findOne({ _id: id, createdBy: user._id })

        if (!Category) {
            throw new NotFoundException("Category not found")
        }

        if (name && await this.CategoryRepo.findOne({ name })) {
            throw new ConflictException("Category name already exists")
        }

        const strictIds = [...new Set(brands || [])]

        if (brands && (await this.BrandRepo.find({ filter: { _id: { $in: strictIds } } })).length != strictIds.length) {
            throw new NotFoundException("Brands not found")
        }

        const updatedCategory = await this.CategoryRepo.findOneAndUpdate(
            { _id: id, createdBy: user._id },
            { name, slogan, brands: strictIds }
        )
        return updatedCategory

    }

    async updateCategoryImage(
        id: Types.ObjectId,
        file: Express.Multer.File,
        user: HUserDocument,
    ) {


        const Category = await this.CategoryRepo.findOne({ _id: id, createdBy: user._id })

        if (!Category) {
            throw new NotFoundException("Category not found")
        }

        const url = await this.s3Service.uploadFile({
            path: `Categories/${Category.assetFolderId}`,
            file
        })


        const updatedCategory = await this.CategoryRepo.findOneAndUpdate({ _id: id }, { image: url })
        if (!updatedCategory) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException("Failed to update Category")
        }

        await this.s3Service.deleteFile({
            Key: Category.image
        })

        return updatedCategory

    }

    async freezeCategory(
        id: Types.ObjectId,
        user: HUserDocument
    ) {
        const Category = await this.CategoryRepo.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, { deletedAt: new Date(), updatedBy: user._id })
        if (!Category) {
            throw new NotFoundException("Category not found or already freezed")
        }
        return Category

    }

    async restoreCategory(
        id: Types.ObjectId,
        user: HUserDocument
    ) {
        const Category = await this.CategoryRepo.findOneAndUpdate({ _id: id, paranoid: false, deletedAt: { $exists: true } }, { $unset: { deletedAt: '' }, restoredAt: new Date(), updatedBy: user._id })
        if (!Category) {
            throw new NotFoundException("Category not found or already restored")
        }
        return Category

    }

    async deleteCategory(
        id: Types.ObjectId,
    ) {
        const Category = await this.CategoryRepo.findOneAndDelete({
            _id: id, paranoid: false, deletedAt: { $exists: true }
        })
        if (!Category) {
            throw new NotFoundException("Category not found or already Deleted")
        }
        await this.s3Service.deleteFile({
            Key: Category.image
        })
        return Category
    }

    async getAllCategories(
        query: QueryDto
    ) {
        const { page = 1, limit = 2, search } = query
        const { currentPage, count, numberOfPages, docs } = await this.CategoryRepo.paginate({
            filter: {
                ...(search ? { $or: [{ name: { $regex: search, $options: "i" } }, { slogan: { $regex: search, $options: "i" } }] } : {})
            },
            query: { page, limit }
        })
        return { currentPage, count, numberOfPages, docs }

    }


}
