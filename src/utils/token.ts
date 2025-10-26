/* eslint-disable */
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    Injectable,
} from '@nestjs/common';
import { RevokeTokenRepository } from '../DB/repos/revokeToken.repository';
import { UserRepo } from 'src/DB';

@Injectable()
export class TokenService {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly revokeTokenRepo: RevokeTokenRepository,
    ) { }

    async generateToken({
        payload,
        signature,
        options,
    }: {
        payload: object;
        signature: string;
        options?: jwt.SignOptions;
    }): Promise<string> {
        return jwt.sign(payload, signature, options);
    }

    async verifyToken({
        token,
        signature,
    }: {
        token: string;
        signature: string;
    }): Promise<JwtPayload> {
        return jwt.verify(token, signature) as JwtPayload;
    }

    async decodedTokenAndFetchUser(token: string, signature: string) {
        const decoded = await this.verifyToken({ token, signature });

        if (!decoded) {
            throw new BadRequestException('Invalid token');
        }

        const user = await this.userRepo.findOne({ email: decoded?.email });
        if (!user) {
            throw new NotFoundException('User does not exist!');
        }

        if (!user?.confirmed) {
            throw new BadRequestException(
                'Please confirm your email first or account is frozen.',
            );
        }

        if (await this.revokeTokenRepo.findOne({ tokenId: decoded?.jti })) {
            throw new UnauthorizedException('Token has been revoked.');
        }

        // if (user?.changeCredentials?.getTime()! > decoded?.iat! * 1000) {
        //     throw new UnauthorizedException('Token has been revoked.');
        // }

        return { decoded, user };
    }
}
