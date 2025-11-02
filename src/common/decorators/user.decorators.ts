import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
/* eslint-disable */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';



@ValidatorConstraint({ name: 'matchFields', async: false })
export class MatchFields implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        return value === args.object[args.constraints[0]]
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return `${args.property} and ${args.constraints[0]} do not match`;
    }
}

export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: MatchFields,
        });
    };
}




export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
