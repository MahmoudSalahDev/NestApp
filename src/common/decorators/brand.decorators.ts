/* eslint-disable */
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";




export function AtLeastOne(RequiredFields: string[], validationOptions?: ValidationOptions) {
    return function (constructor: Function) {
        registerDecorator({
            target: constructor,
            propertyName: "",
            options: validationOptions,
            constraints:RequiredFields,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return RequiredFields.some(filed => args.object[filed])
                },

                defaultMessage(args: ValidationArguments) {
                    return `atleast one of the required fields ${RequiredFields.join(" , ")} is missing`;
                }
            },
        });
    };
}


