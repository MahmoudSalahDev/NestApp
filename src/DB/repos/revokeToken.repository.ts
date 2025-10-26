/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HRevokeTokenDocument, RevokeToken } from '../Models/revokeToken';


@Injectable()
export class RevokeTokenRepository {
    constructor(
        @InjectModel(RevokeToken.name)
        private readonly revokeTokenModel: Model<HRevokeTokenDocument>,
    ) { }

    async findOne(filter: any) {
        return this.revokeTokenModel.findOne(filter);
    }

    async create(data: Partial<RevokeToken>) {
        return this.revokeTokenModel.create(data);
    }
}
