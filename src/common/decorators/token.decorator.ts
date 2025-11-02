import { SetMetadata } from "@nestjs/common"
import { TokenType } from "../enums"

export const TokenName = "tokenType"

export const Token=(tokenType:TokenType = TokenType.access)=>{
    return     SetMetadata(TokenName, tokenType)
}