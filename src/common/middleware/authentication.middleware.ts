
/* eslint-disable */
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from 'src/utils/token';
import { UserWithRequest } from '../interfaces';
import { TokenType } from '../enums';

export const tokenType = (typeToken: TokenType = TokenType.access) => {
    return (req: UserWithRequest, res: Response, next: NextFunction) => {
        req.typeToken = typeToken

        next()
    }
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(
        private readonly tokenService: TokenService
    ) { }

    async use(req: UserWithRequest, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers
            const [prefix, token] = authorization?.split(" ") || []

            if (!prefix || !token) {
                throw new BadRequestException("Token not exist!sdas")
            }
            const signature = await this.tokenService.GetSignature(prefix, req.typeToken);

            if (!signature) {
                throw new BadRequestException("InValid signature");
            }
            const { user, decoded } = await this.tokenService.decodedTokenAndFetchUser(token, signature)
            if (!decoded) {
                throw new BadRequestException("InValid Token decoded");
            }
            // req.user = decoded?.user
            req.user = user
            req.decoded = decoded
            return next()
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
