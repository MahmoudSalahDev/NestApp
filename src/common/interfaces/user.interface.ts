import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HUserDocument } from "src/DB";
import { TokenType } from "../enums";


export interface UserWithRequest extends Request{
    user:HUserDocument;
    decoded:JwtPayload;
    typeToken?:TokenType;
}