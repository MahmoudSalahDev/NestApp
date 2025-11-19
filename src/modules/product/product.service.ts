/* eslint-disable */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto, updateProductDto } from './product.dto';
import { BrandRepo, CategoryRepo, HUserDocument, ProductRepo, UserRepo } from 'src/DB';
import { S3Service } from 'src/service/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {

    constructor(
        private readonly ProductRepo: ProductRepo,
        private readonly CategoryRepo: CategoryRepo,
        private readonly BrandRepo: BrandRepo,
        private readonly s3Service: S3Service,
        private readonly userRepo: UserRepo,
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
            variants: ProductDto.variants, 
            createdBy: user._id
        });


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

    async updateProduct(
    ProductDto: updateProductDto,
    user: HUserDocument,
    id: Types.ObjectId
) {
    let { name, description, price, discount, quantity, stock, brand, category, variants } = ProductDto;

    let product = await this.ProductRepo.findOne({ _id: id });
    if (!product) {
        throw new NotFoundException("product not found");
    }

    if (brand) {
        const brandExists = await this.BrandRepo.findOne({ _id: brand });
        if (!brandExists) {
            throw new NotFoundException("Brand not found");
        }
    }

    if (category) {
        const categoryExists = await this.CategoryRepo.findOne({ _id: category });
        if (!categoryExists) {
            throw new NotFoundException("category not found");
        }
    }

    if (price && discount) {
        price = price - (price * (discount / 100));
    } else if (price) {
        price = price - (price * (product.discount / 100));
    } else if (discount) {
        price = product.price - (product.price * (discount / 100));
    }

    if (stock) {
        if (stock > product.quantity) {
            throw new BadRequestException("stock must be less than quantity");
        }
    }

    const updateData: any = {
        ...ProductDto,
        price,
        discount,
        stock,
        quantity
    };

    if (variants !== undefined) {
        updateData.variants = variants;
    }

    product = await this.ProductRepo.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true }
    );

    return product;
}


    async updateProductAttachments(
        id: Types.ObjectId,
        files: { mainImage?: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ) {
        const product = await this.ProductRepo.findOne({ _id: id });
        if (!product) {
            throw new NotFoundException("Product not found");
        }

        const categoryExists = await this.CategoryRepo.findOne({ _id: product.category });
        if (!categoryExists) {
            throw new NotFoundException("Category not found");
        }

        const updates: Partial<any> = {};

        if (files.mainImage && files.mainImage.length > 0) {
            const newMainImage = await this.s3Service.uploadFile({
                path: `Categories/${categoryExists.assetFolderId}/products/mainImage`,
                file: files.mainImage[0]
            });

            if (product.mainImage) {
                await this.s3Service.deleteFile({ Key: product.mainImage });
            }

            updates.mainImage = newMainImage;
        }

        if (files.subImages && files.subImages.length > 0) {
            const newSubImages = await this.s3Service.uploadFiles({
                path: `Categories/${categoryExists.assetFolderId}/products/subImages`,
                files: files.subImages
            });

            if (product.subImages && product.subImages.length > 0) {
                await this.s3Service.deleteFiles({ urls: product.subImages });
            }

            updates.subImages = newSubImages;
        }

        const updatedProduct = await this.ProductRepo.findOneAndUpdate(
            { _id: id },
            updates,
            { new: true }
        );

        return updatedProduct;
    }


    async addToWishList(id: Types.ObjectId, user: HUserDocument) {


        let product = await this.ProductRepo.findOne({ _id: id })
        if (!product) {
            throw new NotFoundException("product not found")
        }


        let userExists = await this.userRepo.findOneAndUpdate(
            { _id: user.id, wishList: { $in: id } },
            {
                $pull: {
                    wishList: id
                }
            })

        if (!userExists) {
            userExists = await this.userRepo.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        wishList: id
                    }
                }
            )
        }


        return userExists
    }


}
