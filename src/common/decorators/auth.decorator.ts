
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Token } from './token.decorator';
import { Role } from './role.decorator';
import { TokenType, UserRole } from '../enums';
import { AuthenticaionGuard } from '../guards';
import { AuthorizaionGuard } from '../guards/authorization.guard';

export function Auth({
    tokenType = TokenType.access,
    role = [UserRole.user],
}: {
    tokenType?: TokenType;
    role?: UserRole[];
} ={}) {
    return applyDecorators(
        Token(tokenType),
        Role(role),
        UseGuards(AuthenticaionGuard, AuthorizaionGuard),
    );
}

