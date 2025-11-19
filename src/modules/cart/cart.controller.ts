/* eslint-disable */
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import {  CreateCartDto, ParamDto, UpdateQuantityDto } from './cart.dto';
import { Auth, User } from 'src/common/decorators';
import { TokenType, UserRole } from 'src/common/enums';
import type { HUserDocument } from 'src/DB';
import { CartService } from './cart.service';

@Controller('Cart')
export class CartController {

    constructor(private readonly CartService: CartService) { }




    @Post()
    @Auth({
        role: [UserRole.user, UserRole.admin],
        tokenType: TokenType.access
    })
    async createCart(
        @Body() CartDto: CreateCartDto,
        @User() user: HUserDocument,
    ) {
        const Cart = await this.CartService.createCart(CartDto, user);
        return { message: 'done', Cart }
    }


    @Delete(':id')
    @Auth({
        role: [UserRole.user, UserRole.admin],
        tokenType: TokenType.access
    })
    async removeProductFromCart(
        @Param() param: ParamDto,
        @User() user: HUserDocument,
    ) {
        const Cart = await this.CartService.removeProductFromCart(param.id, user);
        return { message: 'done', Cart }
    }

    
    @Put(':id')
    @Auth({
        role: [UserRole.user, UserRole.admin],
        tokenType: TokenType.access
    })
    async updateQuantity(
        @Param() param: ParamDto,
        @User() user: HUserDocument,
        @Body() body: UpdateQuantityDto,
    ) {
        const Cart = await this.CartService.updateQuantity(param.id, user , body);
        return { message: 'done', Cart }
    }



   




}
