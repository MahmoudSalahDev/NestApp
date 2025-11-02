/* eslint-disable */

import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/utils/token';
import { UserWithRequest } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { TokenName } from '../decorators';

@Injectable()
export class AuthenticaionGuard implements CanActivate {

  constructor(
    private readonly tokenService:TokenService,
    private readonly reflector:Reflector

  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {


    const tokenType = this.reflector.get(TokenName,context.getHandler())
    // console.log(tokenType);

    let req: any
    let authorization: string = ""

    if (context.getType() == "http") {
      req = context.switchToHttp().getRequest()
      authorization = req.headers.authorization!
    }

    try {
      const [prefix, token] = authorization?.split(" ") || []

      if (!prefix || !token) {
        throw new BadRequestException("Token not exist!sdas")
      }
      const signature = await this.tokenService.GetSignature(prefix,tokenType);

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
      return true
    } catch (error) {
      throw new BadRequestException(error.message);
    }


    return true;
  }
}
