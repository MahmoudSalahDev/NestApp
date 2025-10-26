import { hash, compare  } from "bcrypt"
/* eslint-disable */



export const Hash = async (plainText: string, saltRound: number = Number(process.env.SALT_ROUNDS)) => {
    return hash(plainText, saltRound)
}

export const Compare = async (plainText: string, cipherText: string) => {
    return compare(plainText, cipherText)
}