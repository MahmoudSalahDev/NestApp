/* eslint-disable */


// import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';

// @Injectable()
// export class MatchPassword implements PipeTransform {
//     transform(value: any, metadata: ArgumentMetadata) {
//         // return value;
//         // console.log({value , metadata});
//         if(value.password !== value.cPassword){
//             throw new HttpException("password and cPassword should be the same",HttpStatus.BAD_REQUEST)
//         }
//         return value
//     }
// }



import { PipeTransform, ArgumentMetadata, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) { }
    transform(value: unknown, metadata: ArgumentMetadata) {
        const { success, error } = this.schema.safeParse(value);
        if (!success) {
            throw new HttpException({
                message:"Validation error",
                error:error.issues.map((issue)=>{
                    return {
                        path:issue.path,
                        message:issue.message
                    }
                })
            }, HttpStatus.BAD_REQUEST);
        }
        return value
    }
}
