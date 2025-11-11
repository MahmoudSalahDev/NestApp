/* eslint-disable */
import {  ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Types } from "mongoose";



@ValidatorConstraint({ name: 'IdsMongo', async: false })
export class IdsMongo implements ValidatorConstraintInterface {
    validate(ids: any, args: ValidationArguments) {
        if (!Array.isArray(ids)) return false;
        return ids.every(id => Types.ObjectId.isValid(id));
    }

    defaultMessage(args: ValidationArguments) {
        return 'One or more provided IDs are invalid Mongo ObjectIds';
    }
}




