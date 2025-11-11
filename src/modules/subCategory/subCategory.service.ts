/* eslint-disable */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {  CategoryRepo, HUserDocument } from 'src/DB';
import { S3Service } from 'src/service/s3.service';
import { Types } from 'mongoose';
import { randomUUID } from 'crypto';
import { BrandRepo } from 'src/DB';
import { CreateSubCategoryDto, QueryDto, UpdateSubCategoryDto } from './subCategory.dto';
import { SubCategoryRepo } from 'src/DB/repos/subCategory.repo';

@Injectable()
export class SubCategoryService {

    constructor(
        private readonly SubCategoryRepo: SubCategoryRepo,
        private readonly CategoryRepo: CategoryRepo,
        private readonly s3Service: S3Service,
    ) {

    }


    async createSubCategory(
        SubCategoryDto: CreateSubCategoryDto,
        user: HUserDocument,
        file: Express.Multer.File
    ) {
        const { name, slogan, category } = SubCategoryDto

        const SubCategoryExists = await this.SubCategoryRepo.findOne({ name })

        if (SubCategoryExists) {
            throw new ConflictException("SubCategory name already exists")
        }

        const CategoryExists = await this.CategoryRepo.findOne({ _id:category })

        if (!CategoryExists) {
            throw new NotFoundException("Category not found")
        }
        

        const assetFolderId = randomUUID()

        const url = await this.s3Service.uploadFile({
            path: `SubCategories/${assetFolderId}`,
            file
        })

        const SubCategory = await this.SubCategoryRepo.create({
            name,
            slogan,
            image: url,
            createdBy: user._id,
            assetFolderId,
            category
        })

        if (!SubCategory) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException("Failed to create SubCategory")
        }

        return SubCategory
    }


    async updateSubCategory(
        id: Types.ObjectId,
        SubCategoryDto: UpdateSubCategoryDto,
        user: HUserDocument,
    ) {

        const { name, slogan ,category } = SubCategoryDto

        const SubCategory = await this.SubCategoryRepo.findOne({ _id: id, createdBy: user._id })

        if (!SubCategory) {
            throw new NotFoundException("SubCategory not found")
        }

        if (name && await this.SubCategoryRepo.findOne({ name })) {
            throw new ConflictException("SubCategory name already exists")
        }

        // const strictIds = [...new Set(brands || [])]

        // if (brands && (await this.BrandRepo.find({ filter: { _id: { $in: strictIds } } })).length != strictIds.length) {
        //     throw new NotFoundException("Brands not found")
        // }

        const updatedSubCategory = await this.SubCategoryRepo.findOneAndUpdate(
            { _id: id, createdBy: user._id },
            { name, slogan, category }
        )
        return updatedSubCategory

    }

    async updateSubCategoryImage(
        id: Types.ObjectId,
        file: Express.Multer.File,
        user: HUserDocument,
    ) {


        const SubCategory = await this.SubCategoryRepo.findOne({ _id: id, createdBy: user._id })

        if (!SubCategory) {
            throw new NotFoundException("SubCategory not found")
        }

        const url = await this.s3Service.uploadFile({
            path: `SubCategories/${SubCategory.assetFolderId}`,
            file
        })


        const updatedSubCategory = await this.SubCategoryRepo.findOneAndUpdate({ _id: id }, { image: url })
        if (!updatedSubCategory) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException("Failed to update SubCategory")
        }

        await this.s3Service.deleteFile({
            Key: SubCategory.image
        })

        return updatedSubCategory

    }

    async freezeSubCategory(
        id: Types.ObjectId,
        user: HUserDocument
    ) {
        const SubCategory = await this.SubCategoryRepo.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, { deletedAt: new Date(), updatedBy: user._id })
        if (!SubCategory) {
            throw new NotFoundException("SubCategory not found or already freezed")
        }
        return SubCategory

    }

    async restoreSubCategory(
        id: Types.ObjectId,
        user: HUserDocument
    ) {
        const SubCategory = await this.SubCategoryRepo.findOneAndUpdate({ _id: id, paranoid: false, deletedAt: { $exists: true } }, { $unset: { deletedAt: '' }, restoredAt: new Date(), updatedBy: user._id })
        if (!SubCategory) {
            throw new NotFoundException("SubCategory not found or already restored")
        }
        return SubCategory

    }

    async deleteSubCategory(
        id: Types.ObjectId,
    ) {
        const SubCategory = await this.SubCategoryRepo.findOneAndDelete({
            _id: id, paranoid: false, deletedAt: { $exists: true }
        })
        if (!SubCategory) {
            throw new NotFoundException("SubCategory not found or already Deleted")
        }
        await this.s3Service.deleteFile({
            Key: SubCategory.image
        })
        return SubCategory
    }

    async getAllSubCategories(
        query: QueryDto
    ) {
        const { page = 1, limit = 2, search } = query
        const { currentPage, count, numberOfPages, docs } = await this.SubCategoryRepo.paginate({
            filter: {
                ...(search ? { $or: [{ name: { $regex: search, $options: "i" } }, { slogan: { $regex: search, $options: "i" } }] } : {})
            },
            query: { page, limit }
        })
        return { currentPage, count, numberOfPages, docs }

    }


}
