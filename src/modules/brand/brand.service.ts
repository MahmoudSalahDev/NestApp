/* eslint-disable */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto, QueryDto, UpdateBrandDto } from './brand.dto';
import { BrandRepo, HUserDocument } from 'src/DB';
import { S3Service } from 'src/service/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {

    constructor(
        private readonly brandRepo: BrandRepo,
        private readonly s3Service: S3Service,
    ) {

    }


    async createBrand(
        brandDto: CreateBrandDto,
        user: HUserDocument,
        file: Express.Multer.File
    ) {
        const { name, slogan } = brandDto

        const brandExists = await this.brandRepo.findOne({ name })

        if (brandExists) {
            throw new ConflictException("Brand name already exists")
        }


        const url = await this.s3Service.uploadFile({
            path: "brands",
            file
        })

        const brand = await this.brandRepo.create({
            name,
            slogan,
            image: url,
            createdBy: user._id
        })

        if (!brand) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException("Failed to create brand")
        }

        return brand
    }


    async updateBrand(
        id: Types.ObjectId,
        brandDto: UpdateBrandDto,
        user: HUserDocument,
    ) {

        const { name, slogan } = brandDto

        const brand = await this.brandRepo.findOne({ _id: id, createdBy: user._id })

        if (!brand) {
            throw new NotFoundException("Brand not found")
        }

        if (name && await this.brandRepo.findOne({ name })) {
            throw new ConflictException("Brand name already exists")
        }

        const updatedBrand = await this.brandRepo.findOneAndUpdate({ _id: id, createdBy: user._id }, { name, slogan })
        return updatedBrand

    }

    async updateBrandImage(
        id: Types.ObjectId,
        file: Express.Multer.File,
        user: HUserDocument,
    ) {


        const brand = await this.brandRepo.findOne({ _id: id, createdBy: user._id })

        if (!brand) {
            throw new NotFoundException("Brand not found")
        }

        const url = await this.s3Service.uploadFile({
            path: "brands",
            file
        })


        const updatedBrand = await this.brandRepo.findOneAndUpdate({ _id: id }, { image: url })
        if (!updatedBrand) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException("Failed to update brand")
        }

        await this.s3Service.deleteFile({
            Key: brand.image
        })

        return updatedBrand

    }

    async freezeBrand(
        id: Types.ObjectId,
        user: HUserDocument
    ) {
        const brand = await this.brandRepo.findOneAndUpdate({ _id: id, deletedAt: { $exists: false } }, { deletedAt: new Date(), updatedBy: user._id })
        if (!brand) {
            throw new NotFoundException("Brand not found or already freezed")
        }
        return brand

    }

    async restoreBrand(
        id: Types.ObjectId,
        user: HUserDocument
    ) {
        const brand = await this.brandRepo.findOneAndUpdate({ _id: id, paranoid: false, deletedAt: { $exists: true } }, { $unset: { deletedAt: '' }, restoredAt: new Date(), updatedBy: user._id })
        if (!brand) {
            throw new NotFoundException("Brand not found or already restored")
        }
        return brand

    }

    async deleteBrand(
        id: Types.ObjectId,
    ) {
        const brand = await this.brandRepo.findOneAndDelete({
            _id: id, paranoid: false, deletedAt: { $exists: true }
        })
        if (!brand) {
            throw new NotFoundException("Brand not found or already Deleted")
        }
        await this.s3Service.deleteFile({
            Key: brand.image
        })
        return brand
    }

    async getAllBrands(
        query: QueryDto
    ) {
        const { page = 1, limit = 2, search } = query
        const { currentPage, count, numberOfPages, docs } = await this.brandRepo.paginate({
            filter: {
                ...(search ? { $or: [{ name: { $regex: search, $options: "i" } }, { slogan: { $regex: search, $options: "i" } }] } : {})
            },
            query: { page, limit }
        })
        return { currentPage, count, numberOfPages, docs }
       
    }


}
