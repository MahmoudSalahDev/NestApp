/* eslint-disable */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './product.dto';
import { BrandRepo, CategoryRepo, HUserDocument, ProductRepo } from 'src/DB';
import { S3Service } from 'src/service/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {

    constructor(
        private readonly ProductRepo: ProductRepo,
        private readonly CategoryRepo: CategoryRepo,
        private readonly BrandRepo: BrandRepo,
        private readonly s3Service: S3Service,
    ) {

    }


    async createProduct(
        ProductDto: CreateProductDto,
        user: HUserDocument,
        files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }
    ) {
        let { name, description, price, discount, quantity, stock, brand, category } = ProductDto

        const brandExists = await this.BrandRepo.findOne({ _id: brand })

        if (!brandExists) {
            throw new NotFoundException("Brand not found")
        }

        const categoryExists = await this.CategoryRepo.findOne({ _id: category })

        if (!categoryExists) {
            throw new NotFoundException("category not found")
        }

        if (stock > quantity) {
            throw new BadRequestException("stock must be less than or = quantity")
        }


        price = price - (price * ((discount || 0) / 100))


        const filePath = files.mainImage[0]
        const filePaths = files.subImages



        const mainImage = await this.s3Service.uploadFile({
            path: `Categories/${categoryExists.assetFolderId}/products/mainImage`,
            file: filePath
        })

        const subImages = await this.s3Service.uploadFiles({
            path: `Categories/${categoryExists.assetFolderId}/products/subImages`,
            files: filePaths
        })

        const Product = await this.ProductRepo.create({
            name,
            description,
            price,
            discount,
            quantity,
            stock,
            brand,
            category,
            mainImage,
            subImages,
            createdBy: user._id
        })

        if (!Product) {
            await this.s3Service.deleteFile({
                Key: mainImage
            })
            await this.s3Service.deleteFiles({
                urls: subImages
            })
            throw new InternalServerErrorException("Failed to create Product")
        }

        return Product
    }





}
