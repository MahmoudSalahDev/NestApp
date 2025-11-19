/* eslint-disable */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCartDto, UpdateQuantityDto } from './cart.dto';
import { BrandRepo, CartRepo, CategoryRepo, HUserDocument, ProductRepo } from 'src/DB';
import { S3Service } from 'src/service/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class CartService {

    constructor(
        private readonly CartRepo: CartRepo,
        private readonly productRepo: ProductRepo,
    ) {

    }


    async createCart(
        CartDto: CreateCartDto,
        user: HUserDocument,
    ) {

        const { productId, quantity } = CartDto

        const product = await this.productRepo.findOne({ _id: productId, stock: { $gte: quantity } })

        if (!product) {
            throw new BadRequestException("Product not found")
        }

        const cart = await this.CartRepo.findOne({
            createdBy: user._id
        })

        if (!cart) {
            const newCart = await this.CartRepo.create({
                createdBy: user._id,
                products: [
                    {
                        productId,
                        quantity,
                        finalPrice: product.price
                    }
                ]
            })
            return newCart
        }

        const productCart = cart.products.find((product) => product.productId.toString() === productId.toString())
        if (productCart) {
            throw new ConflictException("Product already exists")
        }

        cart.products.push({
            productId,
            quantity,
            finalPrice: product.price
        })

        await cart.save()
        return cart


    }




    async removeProductFromCart(
        id: Types.ObjectId,
        user: HUserDocument,
    ) {


        const product = await this.productRepo.findOne({ _id: id })

        if (!product) {
            throw new BadRequestException("Product not found")
        }

        const cart = await this.CartRepo.findOne({
            createdBy: user._id,
            // products:{$elemMatch:{productId:id}}
            "products.productId": id
        })

        if (!cart) {
            throw new BadRequestException("Cart not found")
        }

        cart.products = cart.products.filter((product) => product.productId.toString() !== id.toString())



        await cart.save()
        return cart


    }


    async updateQuantity(
        id: Types.ObjectId,
        user: HUserDocument,
        body: UpdateQuantityDto
    ) {

        const { quantity } = body

        const cart = await this.CartRepo.findOne({
            createdBy: user._id,
            "products.productId": id
        })

        if (!cart) {
            throw new BadRequestException("Cart not found")
        }

        cart.products.find((product) => {
            if (product.productId.toString() === id.toString()) {
                product.quantity = quantity
                return product
            }
        })



        await cart.save()
        return cart


    }


}
