import { BadRequestException } from "@nestjs/common"
import type { Request } from "express"
import multer from "multer"
/* eslint-disable */




export const multerLocal = ({ fileTypes = [] }: { fileTypes?: string[] }) => {
    return {
        storage: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: Function) => {
                cb(null, './uploads')
            },
            filename: (req: Request, file: Express.Multer.File, cb: Function) => {
                cb(null, Date.now() + "_" + file.originalname)
            }
        }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
            if (fileTypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(new BadRequestException("Invalid file type"))
            }
        },
        limits:{
            fileSize: 1024 * 1024 * 5
        }
    }
}