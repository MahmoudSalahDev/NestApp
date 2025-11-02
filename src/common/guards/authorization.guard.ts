/* eslint-disable */

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums';
import { RoleName } from '../decorators';

@Injectable()
export class AuthorizaionGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector

  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    try {
      const req = context.switchToHttp().getRequest()

      const access_roles:UserRole = this.reflector.get(RoleName, context.getHandler())
      // console.log(tokenType);
      if (!access_roles.includes(req.user.role)) {
        throw new UnauthorizedException()
      }
      return true;
    } catch (error) {
      throw new BadRequestException(error.message)

    }
  }
}
